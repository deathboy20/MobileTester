import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, orderBy, getDocs, doc, getDoc, limit } from 'firebase/firestore';
import { auth } from '@/lib/firebase-admin';
import { firestore } from '@/firebase';
import type { Job } from '@/lib/types';

export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const statusFilter = searchParams.get('status');
    const jobId = searchParams.get('id');

    // If requesting a specific job
    if (jobId) {
      try {
        const jobRef = doc(firestore, 'jobs', jobId);
        const jobDoc = await getDoc(jobRef);

        if (!jobDoc.exists()) {
          return NextResponse.json(
            { error: 'Job not found' },
            { status: 404 }
          );
        }

        const jobData = jobDoc.data();

        // Verify user owns this job
        if (jobData.userId !== userId) {
          return NextResponse.json(
            { error: 'Unauthorized access to job' },
            { status: 403 }
          );
        }

        const job: Job = {
          id: jobDoc.id,
          ...jobData,
          createdAt: new Date(jobData.createdAt),
          completedAt: jobData.completedAt ? new Date(jobData.completedAt) : undefined,
        } as Job;

        return NextResponse.json({ job });
      } catch (error) {
        console.error('Error fetching job:', error);
        return NextResponse.json(
          { error: 'Failed to fetch job' },
          { status: 500 }
        );
      }
    }

    // Query user's jobs
    try {
      const jobsCollection = collection(firestore, 'jobs');
      let jobsQuery = query(
        jobsCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      // Apply filters
      if (statusFilter && ['queued', 'running', 'completed', 'failed'].includes(statusFilter)) {
        jobsQuery = query(
          jobsCollection,
          where('userId', '==', userId),
          where('status', '==', statusFilter),
          orderBy('createdAt', 'desc')
        );
      }

      // Apply limit
      const limitValue = limitParam ? parseInt(limitParam, 10) : 20;
      if (limitValue > 0) {
        jobsQuery = query(jobsQuery, limit(limitValue));
      }

      const querySnapshot = await getDocs(jobsQuery);
      const jobs: Job[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: new Date(doc.data().createdAt),
        completedAt: doc.data().completedAt ? new Date(doc.data().completedAt) : undefined,
      } as Job));

      // Calculate summary statistics
      const stats = {
        total: jobs.length,
        queued: jobs.filter(job => job.status === 'queued').length,
        running: jobs.filter(job => job.status === 'running').length,
        completed: jobs.filter(job => job.status === 'completed').length,
        failed: jobs.filter(job => job.status === 'failed').length,
      };

      return NextResponse.json({
        jobs,
        stats,
        pagination: {
          limit: limitValue,
          hasMore: jobs.length === limitValue,
        },
      });

    } catch (error) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Unexpected error in jobs API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const body = await request.json();
    const { action, jobId } = body;

    if (action === 'cancel' && jobId) {
      try {
        const jobRef = doc(firestore, 'jobs', jobId);
        const jobDoc = await getDoc(jobRef);

        if (!jobDoc.exists()) {
          return NextResponse.json(
            { error: 'Job not found' },
            { status: 404 }
          );
        }

        const jobData = jobDoc.data();

        // Verify user owns this job
        if (jobData.userId !== userId) {
          return NextResponse.json(
            { error: 'Unauthorized access to job' },
            { status: 403 }
          );
        }

        // Only allow cancelling queued or running jobs
        if (!['queued', 'running'].includes(jobData.status)) {
          return NextResponse.json(
            { error: 'Cannot cancel a completed or failed job' },
            { status: 400 }
          );
        }

        // Cancel the test matrix if it exists
        if (jobData.testMatrixId && jobData.status === 'running') {
          try {
            const { cancelTestMatrix } = await import('@/lib/testlab');
            await cancelTestMatrix(jobData.testMatrixId);
          } catch (error) {
            console.error('Error cancelling test matrix:', error);
            // Continue with marking job as cancelled even if Test Lab cancel fails
          }
        }

        // Update job status
        const { updateDoc } = await import('firebase/firestore');
        await updateDoc(jobRef, {
          status: 'failed',
          completedAt: new Date().toISOString(),
          logs: 'Job cancelled by user',
        });

        return NextResponse.json({
          success: true,
          message: 'Job cancelled successfully',
        });

      } catch (error) {
        console.error('Error cancelling job:', error);
        return NextResponse.json(
          { error: 'Failed to cancel job' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Unexpected error in jobs POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    try {
      const jobRef = doc(firestore, 'jobs', jobId);
      const jobDoc = await getDoc(jobRef);

      if (!jobDoc.exists()) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        );
      }

      const jobData = jobDoc.data();

      // Verify user owns this job
      if (jobData.userId !== userId) {
        return NextResponse.json(
          { error: 'Unauthorized access to job' },
          { status: 403 }
        );
      }

      // Only allow deleting completed or failed jobs
      if (['queued', 'running'].includes(jobData.status)) {
        return NextResponse.json(
          { error: 'Cannot delete a running job. Cancel it first.' },
          { status: 400 }
        );
      }

      // Delete associated APK file from blob storage
      try {
        if (jobData.apkUrl) {
          const { deleteApkFile } = await import('@/lib/blob');
          await deleteApkFile(jobData.apkUrl);
        }
      } catch (error) {
        console.error('Error deleting APK file:', error);
        // Continue with job deletion even if file deletion fails
      }

      // Delete job document
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(jobRef);

      return NextResponse.json({
        success: true,
        message: 'Job deleted successfully',
      });

    } catch (error) {
      console.error('Error deleting job:', error);
      return NextResponse.json(
        { error: 'Failed to delete job' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Unexpected error in jobs DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
