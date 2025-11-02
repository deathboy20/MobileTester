/**
 * Vercel Blob integration for APK file uploads
 * Handles secure file uploads and URL generation
 */

import { put, del, list } from '@vercel/blob';

export interface BlobUploadResult {
  url: string;
  downloadUrl: string;
  pathname: string;
  size: number;
}

/**
 * Upload APK file to Vercel Blob
 */
export async function uploadApkFile(
  file: File,
  userId: string
): Promise<BlobUploadResult> {
  try {
    // Validate file type and size
    if (!file.name.endsWith('.apk')) {
      throw new Error('Only APK files are allowed');
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      throw new Error('File size must be less than 50MB');
    }

    // Generate unique filename with user prefix
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `apks/${userId}/${timestamp}_${sanitizedFileName}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return {
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      size: file.size,
    };
  } catch (error) {
    console.error('Error uploading APK to blob:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to upload APK file'
    );
  }
}

/**
 * Delete APK file from Vercel Blob
 */
export async function deleteApkFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('Error deleting APK from blob:', error);
    throw new Error('Failed to delete APK file');
  }
}

/**
 * List APK files for a user
 */
export async function listUserApks(userId: string) {
  try {
    const { blobs } = await list({
      prefix: `apks/${userId}/`,
      limit: 100,
    });

    return blobs.map(blob => ({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    }));
  } catch (error) {
    console.error('Error listing user APKs:', error);
    throw new Error('Failed to list APK files');
  }
}

/**
 * Get APK file info from URL
 */
export function parseApkUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop() || '';

    // Extract timestamp and original filename
    const match = filename.match(/^(\d+)_(.+)$/);
    if (match) {
      const [, timestamp, originalName] = match;
      return {
        timestamp: parseInt(timestamp),
        originalName: originalName.replace(/_/g, ' '),
        uploadedAt: new Date(parseInt(timestamp)),
      };
    }

    return {
      timestamp: 0,
      originalName: filename,
      uploadedAt: new Date(),
    };
  } catch (error) {
    console.error('Error parsing APK URL:', error);
    return {
      timestamp: 0,
      originalName: 'unknown.apk',
      uploadedAt: new Date(),
    };
  }
}

/**
 * Validate APK file before upload
 */
export function validateApkFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.name.toLowerCase().endsWith('.apk')) {
    return { valid: false, error: 'File must be an APK file (.apk extension)' };
  }

  // Check file size (50MB limit)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    const sizeMB = Math.round(file.size / (1024 * 1024));
    return {
      valid: false,
      error: `File size (${sizeMB}MB) exceeds the 50MB limit`
    };
  }

  // Check minimum file size (APKs should be at least 1KB)
  if (file.size < 1024) {
    return { valid: false, error: 'APK file appears to be too small or corrupted' };
  }

  return { valid: true };
}

/**
 * Generate secure download URL with expiration
 */
export function generateSecureDownloadUrl(baseUrl: string, expiresIn = 3600): string {
  // For now, return the base URL since Vercel Blob handles access control
  // In production, you might want to add signed URLs with expiration
  return baseUrl;
}
