import { NextRequest, NextResponse } from 'next/server';
import { uploadApkFile, validateApkFile } from '@/lib/blob';
import { addDoc, collection } from 'firebase/firestore';
import { auth } from '@/lib/firebase-admin';
import { firestore } from '@/firebase';
import { TOP_20_DEVICES, DEFAULT_DEVICE_SELECTION } from '@/constants/devices';
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

    // Parse form data
    const formData = await request.formData();
    const apkFile = formData.get('apk') as File;
    const readme = (formData.get('readme') as string) || '';
    const devicesString = formData.get('devices') as string;

    // Validate required fields
    if (!apkFile) {
      return NextResponse.json(
        { error: 'APK file is required' },
        { status: 400 }
      );
    }

    // Validate APK file
    const validation = validateApkFile(apkFile);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Validate README size (10KB limit)
    if (readme.length > 10 * 1024) {
      return NextResponse.json(
        { error: 'README must be less than 10KB' },
        { status: 400 }
      );
    }

    // Parse and validate devices
    let devices: string[];
    try {
      devices = devicesString ? JSON.parse(devicesString) : DEFAULT_DEVICE_SELECTION;
    } catch (error) {
      devices = DEFAULT_DEVICE_SELECTION;
    }

    // Validate selected devices exist
    const validDevices = devices.filter(deviceId =>
      TOP_20_DEVICES.some(device => device.id === deviceId)
    );

    if (validDevices.length === 0) {
      validDevices.push(...DEFAULT_DEVICE_SELECTION);
    }

    // Upload APK to Vercel Blob
    let apkUrl: string;
    try {
      const uploadResult = await uploadApkFile(apkFile, userId);
      apkUrl = uploadResult.url;
    } catch (error) {
      console.error('Error uploading APK:', error);
      return NextResponse.json(
        { error: 'Failed to upload APK file' },
        { status: 500 }
      );
    }

    // Create job document in Firestore
    const newJob: Omit<Job, 'id'> = {
      userId,
      apkUrl,
      readme,
      devices: validDevices,
      status: 'queued',
      createdAt: new Date(),
    };

    try {
      const jobsCollection = collection(firestore, 'jobs');
      const docRef = await addDoc(jobsCollection, {
        ...newJob,
        createdAt: new Date().toISOString(),
      });

      // Start the testing process asynchronously
      // This would typically trigger a background job or Cloud Function
      startTestingProcess(docRef.id, apkUrl, validDevices).catch(error => {
        console.error('Error starting testing process:', error);
      });

      return NextResponse.json({
        success: true,
        jobId: docRef.id,
        message: 'APK uploaded successfully and testing has been queued',
      });
    } catch (error) {
      console.error('Error creating job document:', error);
      return NextResponse.json(
        { error: 'Failed to create test job' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in upload API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Start the testing process (would typically be a background job)
 */
async function startTestingProcess(
  jobId: string,
  apkUrl: string,
  devices: string[]
): Promise<void> {
  try {
    // This would typically trigger Firebase Test Lab via Cloud Functions
    // For now, we'll simulate the process
    console.log(`Starting test process for job ${jobId} with ${devices.length} devices`);

    // Update job status to running
    // This would be handled by your Cloud Function or background service

    // The actual testing would happen here:
    // 1. Upload APK to Firebase Storage
    // 2. Create test matrix in Firebase Test Lab
    // 3. Monitor test progress
    // 4. Collect results and generate AI report
    // 5. Update job status to completed

  } catch (error) {
    console.error('Error in testing process:', error);
    // Update job status to failed
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'Upload endpoint. Use POST to upload APK files.' },
    { status: 200 }
  );
}
