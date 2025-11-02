import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase-admin';
import { firestore } from '@/firebase';
import { startTestMatrix, mockTestMatrix } from '@/lib/testlab';
import type { Job } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let decodedClaims;
    try {
      decodedClaims = await auth().verifySessionCookie(sessionCookie, true);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const userId = decodedClaims.uid;

    // Parse request body
    const body = await request.json();
    const { jobId, apkUrl, devices } = body;

    if (!jobId || !apkUrl || !devices || !Array.isArray(devices)) {
      return NextResponse.json(
        { error: 'Missing required fields: jobId, apkUrl, devices' },
        { status: 400 }
      );
    }

    // Update job status to running
    const jobRef = doc(firestore, 'jobs', jobId);
    await updateDoc(jobRef, {
      status: 'running',
      startedAt: new Date().toISOString(),
    });

    // Start test matrix
    let testLabJob;
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.GROQ_API_KEY;

    if (isDevelopment) {
      // Use mock testing in development
      testLabJob = await mockTestMatrix(apkUrl, devices);
      console.log('🧪 Using mock testing for development');
    } else {
      // Use real Firebase Test Lab in production
      testLabJob = await startTestMatrix(apkUrl, devices);
    }

    // Update job with test matrix ID
    await updateDoc(jobRef, {
      testMatrixId: testLabJob.testMatrixId,
      testStatus: testLabJob.status,
    });

    // Start monitoring the test progress (in a real app, this would be a background job)
    monitorTestProgress(jobId, testLabJob.testMatrixId, isDevelopment).catch(error => {
      console.error('Error monitoring test progress:', error);
    });

    return NextResponse.json({
      success: true,
      testMatrixId: testLabJob.testMatrixId,
      message: 'Test matrix started successfully',
    });

  } catch (error) {
    console.error('Error starting test matrix:', error);
    return NextResponse.json(
      { error: 'Failed to start test matrix' },
      { status: 500 }
    );
  }
}

/**
 * Monitor test progress and update job status
 */
async function monitorTestProgress(
  jobId: string,
  testMatrixId: string,
  useMock: boolean
): Promise<void> {
  try {
    const maxAttempts = 30; // 15 minutes max (30 * 30s)
    let attempts = 0;

    const checkStatus = async (): Promise<void> => {
      attempts++;

      if (attempts > maxAttempts) {
        // Timeout - mark job as failed
        const jobRef = doc(firestore, 'jobs', jobId);
        await updateDoc(jobRef, {
          status: 'failed',
          completedAt: new Date().toISOString(),
          logs: 'Test timed out after 15 minutes',
        });
        return;
      }

      try {
        let testResult;

        if (useMock) {
          // Simulate test completion after a few checks
          if (attempts >= 3) {
            const { mockTestResults } = await import('@/lib/testlab');
            testResult = await mockTestResults(testMatrixId);
          } else {
            // Still running
            setTimeout(checkStatus, 30000); // Check again in 30 seconds
            return;
          }
        } else {
          const { getTestMatrixStatus } = await import('@/lib/testlab');
          testResult = await getTestMatrixStatus(testMatrixId);

          if (testResult.status === 'finished' || testResult.status === 'error' || testResult.status === 'cancelled') {
            // Test completed
          } else {
            // Still running, check again later
            setTimeout(checkStatus, 30000); // Check again in 30 seconds
            return;
          }
        }

        // Test completed - process results
        await processTestResults(jobId, testResult);

      } catch (error) {
        console.error('Error checking test status:', error);
        setTimeout(checkStatus, 60000); // Retry in 1 minute
      }
    };

    // Start monitoring with initial delay
    setTimeout(checkStatus, 10000); // First check after 10 seconds

  } catch (error) {
    console.error('Error in monitor test progress:', error);
  }
}

/**
 * Process completed test results and generate AI analysis
 */
async function processTestResults(jobId: string, testResult: any): Promise<void> {
  try {
    const jobRef = doc(firestore, 'jobs', jobId);

    if (testResult.status === 'error' || testResult.status === 'cancelled') {
      // Test failed
      await updateDoc(jobRef, {
        status: 'failed',
        completedAt: new Date().toISOString(),
        logs: `Test ${testResult.status}: ${JSON.stringify(testResult.results)}`,
      });
      return;
    }

    // Test completed successfully - generate AI analysis
    const { analyzeTestResults, mockAnalyzeTestResults } = await import('@/lib/ai');
    const { getDoc } = await import('firebase/firestore');

    // Get job details for AI analysis
    const jobDoc = await getDoc(jobRef);
    const jobData = jobDoc.data();

    if (!jobData) {
      throw new Error('Job data not found');
    }

    const analysisInput = {
      testResults: testResult.results,
      readme: jobData.readme || '',
      apkName: jobData.apkUrl.split('/').pop() || 'app.apk',
    };

    // Generate AI report
    let report;
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.GROQ_API_KEY;

    if (isDevelopment) {
      report = await mockAnalyzeTestResults(analysisInput);
    } else {
      report = await analyzeTestResults(analysisInput);
    }

    // Calculate test duration
    const startTime = new Date(jobData.startedAt || jobData.createdAt);
    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

    // Update job with results
    await updateDoc(jobRef, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      duration,
      logs: JSON.stringify(testResult.results),
      report,
      videos: testResult.videoUrls || [],
    });

    console.log(`✅ Job ${jobId} completed successfully`);

  } catch (error) {
    console.error('Error processing test results:', error);

    // Mark job as failed
    const jobRef = doc(firestore, 'jobs', jobId);
    await updateDoc(jobRef, {
      status: 'failed',
      completedAt: new Date().toISOString(),
      logs: `Error processing results: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'Test start endpoint. Use POST to start tests.' },
    { status: 200 }
  );
}
