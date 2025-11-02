/**
 * Firebase Test Lab integration for Android APK testing
 * Handles device testing, result retrieval, and status monitoring
 */

import { GoogleAuth } from 'google-auth-library';
import { TOP_20_DEVICES, DEFAULT_DEVICE_SELECTION } from '@/constants/devices';
import type { TestResult, Device } from '@/lib/types';

export interface TestLabConfig {
  projectId: string;
  bucketName: string;
  timeout: number; // in seconds
}

export interface TestLabJob {
  testMatrixId: string;
  projectId: string;
  devices: string[];
  status: 'pending' | 'running' | 'finished' | 'error' | 'cancelled';
  createdAt: Date;
  finishedAt?: Date;
}

export interface TestLabResult {
  testMatrixId: string;
  status: 'finished' | 'error' | 'cancelled';
  results: TestResult[];
  logUrls: { device: string; url: string }[];
  videoUrls: { device: string; url: string }[];
}

/**
 * Initialize Google Auth for Firebase Test Lab
 */
async function getAuthClient() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  return await auth.getClient();
}

/**
 * Start a test matrix in Firebase Test Lab
 */
export async function startTestMatrix(
  apkUrl: string,
  devices: string[] = DEFAULT_DEVICE_SELECTION,
  options: {
    testTimeout?: number;
    projectId?: string;
    bucketName?: string;
  } = {}
): Promise<TestLabJob> {
  try {
    const {
      testTimeout = 600, // 10 minutes default
      projectId = process.env.FIREBASE_PROJECT_ID!,
      bucketName = `${projectId}_test_results`,
    } = options;

    const authClient = await getAuthClient();

    // Map device IDs to Test Lab device specifications
    const deviceMatrix = devices.map(deviceId => {
      const device = TOP_20_DEVICES.find(d => d.id === deviceId);
      if (!device) {
        throw new Error(`Device ${deviceId} not found in supported devices`);
      }

      return {
        androidDeviceList: {
          androidDevices: [{
            androidModelId: convertDeviceIdToModel(device.id),
            androidVersionId: device.apiLevel.toString(),
            locale: 'en_US',
            orientation: 'portrait',
          }]
        }
      };
    });

    // Create test matrix request
    const requestBody = {
      testSpecification: {
        androidInstrumentationTest: {
          testApk: {
            gcsPath: apkUrl,
          },
          appApk: {
            gcsPath: apkUrl,
          },
          testTimeout: `${testTimeout}s`,
        },
      },
      environmentMatrix: {
        androidDeviceList: {
          androidDevices: deviceMatrix[0].androidDeviceList.androidDevices,
        },
      },
      resultStorage: {
        googleCloudStorage: {
          gcsPath: `gs://${bucketName}/`,
        },
      },
      projectId,
    };

    // Make API call to create test matrix
    const response = await fetch(
      `https://testing.googleapis.com/v1/projects/${projectId}/testMatrices`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await authClient.getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to start test matrix: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      testMatrixId: result.testMatrixId,
      projectId,
      devices,
      status: 'pending',
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error starting test matrix:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to start test matrix'
    );
  }
}

/**
 * Get test matrix status and results
 */
export async function getTestMatrixStatus(
  testMatrixId: string,
  projectId: string = process.env.FIREBASE_PROJECT_ID!
): Promise<TestLabResult> {
  try {
    const authClient = await getAuthClient();

    const response = await fetch(
      `https://testing.googleapis.com/v1/projects/${projectId}/testMatrices/${testMatrixId}`,
      {
        headers: {
          'Authorization': `Bearer ${await authClient.getAccessToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get test matrix status: ${response.statusText}`);
    }

    const result = await response.json();

    // Parse test results
    const testResults: TestResult[] = [];
    const logUrls: { device: string; url: string }[] = [];
    const videoUrls: { device: string; url: string }[] = [];

    if (result.testExecutions) {
      for (const execution of result.testExecutions) {
        const deviceModel = execution.environment?.androidDevice?.androidModelId || 'unknown';

        testResults.push({
          device: deviceModel,
          status: mapTestLabStatusToResult(execution.state),
          logs: execution.toolResultsExecution?.executionId || '',
          screenshots: execution.testDetails?.progressMessages?.map((msg: any) => msg.screenshotUrl) || [],
          videoUrl: execution.testDetails?.videoRecording?.videoUrl,
          duration: calculateExecutionDuration(execution),
        });

        // Collect log and video URLs
        if (execution.toolResultsExecution?.executionId) {
          logUrls.push({
            device: deviceModel,
            url: `https://console.firebase.google.com/project/${projectId}/testlab/histories/${execution.toolResultsExecution.historyId}/matrices/${execution.toolResultsExecution.executionId}`,
          });
        }

        if (execution.testDetails?.videoRecording?.videoUrl) {
          videoUrls.push({
            device: deviceModel,
            url: execution.testDetails.videoRecording.videoUrl,
          });
        }
      }
    }

    return {
      testMatrixId,
      status: mapTestLabState(result.state),
      results: testResults,
      logUrls,
      videoUrls,
    };
  } catch (error) {
    console.error('Error getting test matrix status:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to get test matrix status'
    );
  }
}

/**
 * Cancel a running test matrix
 */
export async function cancelTestMatrix(
  testMatrixId: string,
  projectId: string = process.env.FIREBASE_PROJECT_ID!
): Promise<void> {
  try {
    const authClient = await getAuthClient();

    const response = await fetch(
      `https://testing.googleapis.com/v1/projects/${projectId}/testMatrices/${testMatrixId}:cancel`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await authClient.getAccessToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to cancel test matrix: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error canceling test matrix:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to cancel test matrix'
    );
  }
}

/**
 * Get available devices from Test Lab
 */
export async function getAvailableDevices(
  projectId: string = process.env.FIREBASE_PROJECT_ID!
): Promise<Device[]> {
  try {
    const authClient = await getAuthClient();

    const response = await fetch(
      `https://testing.googleapis.com/v1/testEnvironmentCatalog/android`,
      {
        headers: {
          'Authorization': `Bearer ${await authClient.getAccessToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get available devices: ${response.statusText}`);
    }

    const result = await response.json();

    // Map Test Lab devices to our Device interface
    const devices: Device[] = [];
    if (result.models) {
      for (const model of result.models) {
        devices.push({
          id: model.id,
          name: model.name,
          manufacturer: model.manufacturer,
          androidVersion: model.supportedVersionIds?.[0] || 'unknown',
          apiLevel: parseInt(model.supportedVersionIds?.[0]) || 0,
          screenSize: `${model.screenDensity}dpi`,
          resolution: `${model.screenX}x${model.screenY}`,
          popular: model.tags?.includes('popular') || false,
        });
      }
    }

    return devices;
  } catch (error) {
    console.error('Error getting available devices:', error);
    return TOP_20_DEVICES; // Fallback to our static list
  }
}

/**
 * Convert our device ID to Test Lab model ID
 */
function convertDeviceIdToModel(deviceId: string): string {
  const mapping: Record<string, string> = {
    'samsung_galaxy_s24': 'sm-s908b',
    'samsung_galaxy_s23': 'sm-s911b',
    'pixel_8_pro': 'husky',
    'pixel_7': 'panther',
    'samsung_galaxy_s22_ultra': 'sm-s908b',
    'pixel_6a': 'bluejay',
    'oneplus_11': 'phn110',
    'xiaomi_13_pro': '2210132C',
    'samsung_galaxy_a54': 'sm-a546b',
    // Add more mappings as needed
  };

  return mapping[deviceId] || 'sm-g973'; // Default to Galaxy S10
}

/**
 * Map Test Lab state to our status
 */
function mapTestLabState(state: string): 'finished' | 'error' | 'cancelled' {
  switch (state) {
    case 'FINISHED':
      return 'finished';
    case 'ERROR':
    case 'UNSUPPORTED_ENVIRONMENT':
    case 'INCOMPATIBLE_ENVIRONMENT':
    case 'INCOMPATIBLE_ARCHITECTURE':
    case 'INVALID':
      return 'error';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return 'error';
  }
}

/**
 * Map individual test execution status
 */
function mapTestLabStatusToResult(state: string): 'passed' | 'failed' | 'skipped' {
  switch (state) {
    case 'FINISHED':
      return 'passed';
    case 'ERROR':
    case 'INCOMPATIBLE_ENVIRONMENT':
    case 'INCOMPATIBLE_ARCHITECTURE':
    case 'INVALID':
      return 'failed';
    case 'SKIPPED':
    case 'CANCELLED':
      return 'skipped';
    default:
      return 'failed';
  }
}

/**
 * Calculate execution duration from Test Lab execution object
 */
function calculateExecutionDuration(execution: any): number {
  if (execution.completionTime && execution.creationTime) {
    const start = new Date(execution.creationTime.seconds * 1000);
    const end = new Date(execution.completionTime.seconds * 1000);
    return Math.round((end.getTime() - start.getTime()) / 1000); // Duration in seconds
  }
  return 0;
}

/**
 * Mock test matrix for development/testing
 */
export async function mockTestMatrix(
  apkUrl: string,
  devices: string[] = DEFAULT_DEVICE_SELECTION
): Promise<TestLabJob> {
  console.log('🧪 Mock Test Lab: Starting test matrix for', devices.length, 'devices');

  return {
    testMatrixId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    projectId: process.env.FIREBASE_PROJECT_ID || 'mock-project',
    devices,
    status: 'pending',
    createdAt: new Date(),
  };
}

/**
 * Mock test results for development/testing
 */
export async function mockTestResults(testMatrixId: string): Promise<TestLabResult> {
  console.log('🧪 Mock Test Lab: Getting results for', testMatrixId);

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  const mockResults: TestResult[] = [
    {
      device: 'Samsung Galaxy S24',
      status: 'passed',
      logs: 'Test completed successfully. No crashes detected.',
      screenshots: ['https://example.com/screenshot1.png'],
      videoUrl: 'https://example.com/video1.mp4',
      duration: 45,
    },
    {
      device: 'Google Pixel 8 Pro',
      status: 'failed',
      logs: 'ANR detected in MainActivity after 5 seconds.',
      screenshots: ['https://example.com/screenshot2.png'],
      videoUrl: 'https://example.com/video2.mp4',
      duration: 30,
    },
  ];

  return {
    testMatrixId,
    status: 'finished',
    results: mockResults,
    logUrls: mockResults.map(r => ({ device: r.device, url: `https://console.firebase.google.com/logs/${r.device}` })),
    videoUrls: mockResults.map(r => ({ device: r.device, url: r.videoUrl || '' })),
  };
}
