import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { auth } from '@/lib/firebase-admin';
import { firestore } from '@/firebase';
import { format } from 'date-fns';
import type { Job, TestResult } from '@/lib/types';
import { getDeviceById } from '@/constants/devices';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const jobId = params.id;

    // Fetch job data
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

    // Generate PDF
    const pdfBytes = await generatePDFReport(job);

    // Return PDF as blob
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="test-report-${jobId}.pdf"`,
        'Content-Length': pdfBytes.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating PDF report:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF report' },
      { status: 500 }
    );
  }
}

/**
 * Generate PDF report from job data
 */
async function generatePDFReport(job: Job): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();

  // Load fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let yPosition = height - 50;
  const margin = 50;
  const lineHeight = 20;

  // Helper function to add text
  const addText = (text: string, options: {
    x?: number;
    y?: number;
    size?: number;
    font?: any;
    color?: any;
    maxWidth?: number;
  } = {}) => {
    const {
      x = margin,
      y = yPosition,
      size = 12,
      font = helveticaFont,
      color = rgb(0, 0, 0),
      maxWidth = width - 2 * margin
    } = options;

    // Handle text wrapping
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = font.widthOfTextAtSize(testLine, size);

      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word); // Word is too long, add it anyway
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    lines.forEach((line, index) => {
      page.drawText(line, {
        x,
        y: y - (index * lineHeight),
        size,
        font,
        color,
      });
    });

    return lines.length * lineHeight;
  };

  // Header
  addText('MobileTester - Test Report', {
    size: 24,
    font: helveticaBoldFont,
    color: rgb(0.2, 0.4, 0.8),
  });
  yPosition -= 40;

  // Job Information
  addText('Job Information', {
    size: 16,
    font: helveticaBoldFont,
    color: rgb(0.2, 0.2, 0.2),
  });
  yPosition -= 30;

  const apkName = job.apkUrl.split('/').pop()?.split('_').slice(1).join('_') || 'app.apk';
  addText(`APK: ${apkName}`, { y: yPosition });
  yPosition -= lineHeight;

  addText(`Status: ${job.status.toUpperCase()}`, { y: yPosition });
  yPosition -= lineHeight;

  addText(`Created: ${format(job.createdAt, 'PPpp')}`, { y: yPosition });
  yPosition -= lineHeight;

  if (job.completedAt) {
    addText(`Completed: ${format(job.completedAt, 'PPpp')}`, { y: yPosition });
    yPosition -= lineHeight;
  }

  if (job.duration) {
    addText(`Duration: ${job.duration} seconds`, { y: yPosition });
    yPosition -= lineHeight;
  }

  addText(`Devices Tested: ${job.devices.length}`, { y: yPosition });
  yPosition -= 40;

  // Test Results Summary
  if (job.logs) {
    try {
      const testResults: TestResult[] = JSON.parse(job.logs);
      const passedTests = testResults.filter(r => r.status === 'passed').length;
      const failedTests = testResults.filter(r => r.status === 'failed').length;
      const passRate = testResults.length > 0 ? Math.round((passedTests / testResults.length) * 100) : 0;

      addText('Test Results Summary', {
        size: 16,
        font: helveticaBoldFont,
        color: rgb(0.2, 0.2, 0.2),
        y: yPosition,
      });
      yPosition -= 30;

      addText(`Total Tests: ${testResults.length}`, { y: yPosition });
      yPosition -= lineHeight;

      addText(`Passed: ${passedTests}`, {
        y: yPosition,
        color: rgb(0, 0.6, 0)
      });
      yPosition -= lineHeight;

      addText(`Failed: ${failedTests}`, {
        y: yPosition,
        color: rgb(0.8, 0, 0)
      });
      yPosition -= lineHeight;

      addText(`Pass Rate: ${passRate}%`, {
        y: yPosition,
        font: helveticaBoldFont,
        color: passRate >= 80 ? rgb(0, 0.6, 0) : rgb(0.8, 0.6, 0)
      });
      yPosition -= 40;

      // Device Results
      if (testResults.length > 0) {
        addText('Device Test Results', {
          size: 16,
          font: helveticaBoldFont,
          color: rgb(0.2, 0.2, 0.2),
          y: yPosition,
        });
        yPosition -= 30;

        testResults.forEach((result, index) => {
          if (yPosition < 100) {
            // Add new page if needed
            const newPage = pdfDoc.addPage([612, 792]);
            yPosition = height - 50;
          }

          const statusColor = result.status === 'passed' ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0);

          addText(`${index + 1}. ${result.device}`, {
            y: yPosition,
            font: helveticaBoldFont,
          });
          yPosition -= lineHeight;

          addText(`   Status: ${result.status.toUpperCase()}`, {
            y: yPosition,
            color: statusColor,
          });
          yPosition -= lineHeight;

          addText(`   Duration: ${result.duration}s`, { y: yPosition });
          yPosition -= lineHeight;

          if (result.logs && result.logs.length < 200) {
            addText(`   Logs: ${result.logs}`, {
              y: yPosition,
              size: 10,
              color: rgb(0.4, 0.4, 0.4),
            });
            yPosition -= lineHeight;
          }

          yPosition -= 10; // Extra spacing between devices
        });

        yPosition -= 20;
      }
    } catch (error) {
      console.error('Error parsing test results:', error);
    }
  }

  // AI Report
  if (job.report) {
    if (yPosition < 150) {
      // Add new page if needed
      pdfDoc.addPage([612, 792]);
      yPosition = height - 50;
    }

    addText('AI Analysis Report', {
      size: 16,
      font: helveticaBoldFont,
      color: rgb(0.2, 0.2, 0.2),
      y: yPosition,
    });
    yPosition -= 30;

    // Summary
    addText('Summary:', {
      font: helveticaBoldFont,
      y: yPosition,
    });
    yPosition -= lineHeight;

    const summaryHeight = addText(job.report.summary, {
      y: yPosition,
      size: 11,
      color: rgb(0.3, 0.3, 0.3),
    });
    yPosition -= summaryHeight + 20;

    // Issues
    if (job.report.issues && job.report.issues.length > 0) {
      addText(`Issues Found (${job.report.issues.length}):`, {
        font: helveticaBoldFont,
        y: yPosition,
      });
      yPosition -= 30;

      job.report.issues.forEach((issue, index) => {
        if (yPosition < 150) {
          // Add new page if needed
          pdfDoc.addPage([612, 792]);
          yPosition = height - 50;
        }

        const severityColor = issue.severity === 'critical' ? rgb(0.8, 0, 0) :
                             issue.severity === 'high' ? rgb(0.8, 0.4, 0) :
                             issue.severity === 'medium' ? rgb(0.6, 0.6, 0) :
                             rgb(0.4, 0.4, 0.4);

        addText(`${index + 1}. ${issue.title}`, {
          y: yPosition,
          font: helveticaBoldFont,
        });
        yPosition -= lineHeight;

        addText(`   Severity: ${issue.severity.toUpperCase()}`, {
          y: yPosition,
          color: severityColor,
        });
        yPosition -= lineHeight;

        const descHeight = addText(`   Description: ${issue.description}`, {
          y: yPosition,
          size: 10,
        });
        yPosition -= descHeight + 5;

        const fixHeight = addText(`   Fix: ${issue.fix}`, {
          y: yPosition,
          size: 10,
          color: rgb(0, 0.4, 0.8),
        });
        yPosition -= fixHeight + 15;
      });
    } else {
      addText('No issues found! Your app appears to be working well.', {
        y: yPosition,
        color: rgb(0, 0.6, 0),
        font: helveticaBoldFont,
      });
      yPosition -= 30;
    }
  }

  // Footer
  const currentPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
  currentPage.drawText(`Generated on ${format(new Date(), 'PPpp')} by MobileTester`, {
    x: margin,
    y: 30,
    size: 8,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  currentPage.drawText('Visit: mobiletester.dev', {
    x: width - margin - 100,
    y: 30,
    size: 8,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  return await pdfDoc.save();
}
