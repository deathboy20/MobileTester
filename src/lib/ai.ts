/**
 * Groq AI integration for analyzing test results and generating bug reports
 * Uses Llama 3 model for intelligent bug detection and fix suggestions
 */

import Groq from 'groq-sdk';
import type { JobReport, JobIssue, TestResult } from '@/lib/types';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export interface AnalysisInput {
  testResults: TestResult[];
  readme: string;
  apkName: string;
}

export interface GroqResponse {
  summary: string;
  issues: Array<{
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    fix: string;
    device?: string;
  }>;
}

/**
 * Analyze test results using Groq AI
 */
export async function analyzeTestResults(
  input: AnalysisInput
): Promise<JobReport> {
  try {
    const prompt = buildAnalysisPrompt(input);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert Android developer and QA engineer. Analyze test results and provide actionable bug fixes and recommendations. Always respond with valid JSON in the exact format requested.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from Groq AI');
    }

    const parsed = JSON.parse(response) as GroqResponse;

    return {
      summary: parsed.summary,
      issues: parsed.issues.map(issue => ({
        title: issue.title,
        description: issue.description,
        severity: issue.severity,
        fix: issue.fix,
        device: issue.device,
      })),
    };
  } catch (error) {
    console.error('Error analyzing test results with Groq:', error);

    // Return fallback analysis
    return generateFallbackAnalysis(input.testResults);
  }
}

/**
 * Build the analysis prompt for Groq AI
 */
function buildAnalysisPrompt(input: AnalysisInput): string {
  const { testResults, readme, apkName } = input;

  const testSummary = testResults
    .map(result => {
      return `Device: ${result.device}
Status: ${result.status}
Duration: ${result.duration}s
Logs: ${result.logs}
${result.screenshots?.length ? `Screenshots: ${result.screenshots.length}` : ''}
---`;
    })
    .join('\n');

  return `Analyze the following Android APK test results and provide a comprehensive bug report.

APP INFORMATION:
Name: ${apkName}
README: ${readme || 'No README provided'}

TEST RESULTS:
${testSummary}

Please analyze these results and respond with a JSON object in this exact format:
{
  "summary": "A brief overview of the test results and overall app health (2-3 sentences)",
  "issues": [
    {
      "title": "Brief issue title",
      "description": "Detailed description of the issue",
      "severity": "low|medium|high|critical",
      "fix": "Specific actionable steps to fix this issue",
      "device": "Device name where this issue occurred (optional)"
    }
  ]
}

Focus on:
1. Crashes, ANRs, and fatal errors (critical/high severity)
2. Performance issues and slow responses (medium severity)
3. UI/UX issues and minor bugs (low/medium severity)
4. Compatibility issues across devices
5. Actionable fix suggestions based on common Android development patterns

If no issues are found, still provide the summary and include any recommendations for improvement.`;
}

/**
 * Generate fallback analysis when AI fails
 */
function generateFallbackAnalysis(testResults: TestResult[]): JobReport {
  const issues: JobIssue[] = [];
  const failedTests = testResults.filter(r => r.status === 'failed');
  const passedTests = testResults.filter(r => r.status === 'passed');

  // Analyze failed tests
  failedTests.forEach(result => {
    if (result.logs.toLowerCase().includes('anr')) {
      issues.push({
        title: 'Application Not Responding (ANR)',
        description: `ANR detected on ${result.device}. The app became unresponsive during testing.`,
        severity: 'high',
        fix: 'Move long-running operations to background threads. Use AsyncTask, Thread, or ExecutorService for heavy computations.',
        device: result.device,
      });
    }

    if (result.logs.toLowerCase().includes('crash') || result.logs.toLowerCase().includes('exception')) {
      issues.push({
        title: 'Application Crash',
        description: `Crash detected on ${result.device}. Check logs for exception details.`,
        severity: 'critical',
        fix: 'Add proper exception handling, null checks, and validate input data. Use try-catch blocks around risky operations.',
        device: result.device,
      });
    }

    if (result.duration > 60) {
      issues.push({
        title: 'Slow Test Execution',
        description: `Test took ${result.duration} seconds on ${result.device}, indicating potential performance issues.`,
        severity: 'medium',
        fix: 'Optimize app startup time, reduce memory usage, and minimize network calls during initialization.',
        device: result.device,
      });
    }
  });

  // Generate summary
  const totalTests = testResults.length;
  const passRate = Math.round((passedTests.length / totalTests) * 100);

  let summary = `Tested on ${totalTests} devices with ${passRate}% pass rate. `;

  if (issues.length === 0) {
    summary += 'No critical issues detected. App appears stable across tested devices.';
  } else {
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;

    if (criticalIssues > 0) {
      summary += `${criticalIssues} critical issue(s) found requiring immediate attention.`;
    } else if (highIssues > 0) {
      summary += `${highIssues} high-priority issue(s) found that should be addressed.`;
    } else {
      summary += `${issues.length} minor issue(s) found with recommendations for improvement.`;
    }
  }

  return {
    summary,
    issues,
  };
}

/**
 * Generate test insights for dashboard
 */
export async function generateTestInsights(
  testResults: TestResult[]
): Promise<{
  compatibility: number;
  performance: number;
  stability: number;
  recommendations: string[];
}> {
  try {
    const totalTests = testResults.length;
    const passedTests = testResults.filter(r => r.status === 'passed').length;
    const failedTests = testResults.filter(r => r.status === 'failed').length;

    // Calculate metrics
    const compatibility = Math.round((passedTests / totalTests) * 100);

    const avgDuration = testResults.reduce((sum, r) => sum + r.duration, 0) / totalTests;
    const performance = Math.max(0, Math.round(100 - (avgDuration - 30) * 2)); // Lower is better for duration

    const crashCount = testResults.filter(r =>
      r.logs.toLowerCase().includes('crash') ||
      r.logs.toLowerCase().includes('anr')
    ).length;
    const stability = Math.max(0, Math.round(100 - (crashCount / totalTests) * 50));

    // Generate recommendations
    const recommendations: string[] = [];

    if (compatibility < 80) {
      recommendations.push('Consider testing on additional device configurations');
    }

    if (performance < 70) {
      recommendations.push('Optimize app startup and runtime performance');
    }

    if (stability < 90) {
      recommendations.push('Address crashes and ANR issues before release');
    }

    if (avgDuration > 45) {
      recommendations.push('Review app initialization and reduce startup time');
    }

    return {
      compatibility,
      performance,
      stability,
      recommendations,
    };
  } catch (error) {
    console.error('Error generating test insights:', error);

    // Return default insights
    return {
      compatibility: 85,
      performance: 75,
      stability: 90,
      recommendations: ['Continue testing on more devices', 'Monitor app performance'],
    };
  }
}

/**
 * Mock AI analysis for development/testing
 */
export async function mockAnalyzeTestResults(
  input: AnalysisInput
): Promise<JobReport> {
  console.log('🤖 Mock AI: Analyzing test results...');

  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 3000));

  const failedTests = input.testResults.filter(r => r.status === 'failed');
  const passedTests = input.testResults.filter(r => r.status === 'passed');

  const mockIssues: JobIssue[] = [];

  if (failedTests.length > 0) {
    mockIssues.push({
      title: 'ANR Detected in Main Thread',
      description: 'The app became unresponsive on Samsung Galaxy S24, likely due to heavy computation on the main UI thread.',
      severity: 'high',
      fix: 'Move the heavy computation in MainActivity.onCreate() to a background thread using AsyncTask or ExecutorService. Consider using ProgressBar to show loading state.',
    });

    mockIssues.push({
      title: 'Network Timeout Exception',
      description: 'Network requests are timing out on slower connections, causing app crashes.',
      severity: 'medium',
      fix: 'Implement proper timeout handling and retry logic. Use OkHttp with reasonable timeout values (30s for connect, 60s for read).',
    });
  }

  if (input.testResults.some(r => r.duration > 45)) {
    mockIssues.push({
      title: 'Slow App Startup',
      description: 'App takes too long to start on some devices, affecting user experience.',
      severity: 'low',
      fix: 'Optimize app initialization by lazy-loading non-essential components and reducing the size of Application.onCreate().',
    });
  }

  const passRate = Math.round((passedTests.length / input.testResults.length) * 100);

  const summary = mockIssues.length === 0
    ? `Great job! Your app passed ${passRate}% of tests with no critical issues found. The app appears stable across all tested devices.`
    : `Your app passed ${passRate}% of tests. Found ${mockIssues.length} issue(s) that need attention before release.`;

  return {
    summary,
    issues: mockIssues,
  };
}

/**
 * Validate Groq API connection
 */
export async function validateGroqConnection(): Promise<boolean> {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'Respond with "OK" if you can read this message.',
        },
      ],
      model: 'llama-3.1-8b-instant',
      max_tokens: 10,
    });

    return response.choices[0]?.message?.content?.includes('OK') || false;
  } catch (error) {
    console.error('Groq API validation failed:', error);
    return false;
  }
}
