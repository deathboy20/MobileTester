'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Download,
  Play,
  AlertCircle,
  CheckCircle,
  Clock,
  Smartphone,
  FileText,
  Video,
  Image as ImageIcon,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import type { Job, TestResult } from '@/lib/types';
import { getDeviceById } from '@/constants/devices';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const jobId = params.id as string;

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs?id=${jobId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Job not found');
          return;
        }
        throw new Error('Failed to fetch job details');
      }

      const data = await response.json();
      setJob(data.job);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshJob = async () => {
    setRefreshing(true);
    await fetchJob();
  };

  useEffect(() => {
    fetchJob();

    // Auto-refresh for running jobs
    let interval: NodeJS.Timeout | null = null;
    if (job?.status === 'queued' || job?.status === 'running') {
      interval = setInterval(() => {
        fetchJob();
      }, 10000); // Refresh every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobId, job?.status]);

  const downloadReport = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/report`);
      if (!response.ok) throw new Error('Failed to generate report');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `test-report-${jobId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'bg-yellow-500';
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued': return <Clock className="h-4 w-4" />;
      case 'running': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-32 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full animate-pulse" />
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Job not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const testResults: TestResult[] = job.logs ? JSON.parse(job.logs) : [];
  const passedTests = testResults.filter(r => r.status === 'passed').length;
  const failedTests = testResults.filter(r => r.status === 'failed').length;
  const passRate = testResults.length > 0 ? Math.round((passedTests / testResults.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
              Job Details
            </h1>
            <p className="text-muted-foreground">
              Created {formatDistanceToNow(job.createdAt)} ago
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refreshJob} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {job.status === 'completed' && job.report && (
            <Button onClick={downloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(job.status)}
            Test Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className={`${getStatusColor(job.status)} text-white`}>
              {job.status.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Testing on {job.devices.length} devices
            </span>
            {job.duration && (
              <span className="text-sm text-muted-foreground">
                Duration: {job.duration}s
              </span>
            )}
          </div>

          {job.status === 'running' && (
            <Progress value={45} className="w-full" />
          )}

          {job.status === 'completed' && testResults.length > 0 && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{failedTests}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{passRate}%</div>
                <div className="text-sm text-muted-foreground">Pass Rate</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="report">AI Report</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>APK Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">File:</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {job.apkUrl.split('/').pop()?.split('_').slice(1).join('_') || 'app.apk'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Uploaded:</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {format(job.createdAt, 'PPpp')}
                  </span>
                </div>
                {job.completedAt && (
                  <div>
                    <span className="font-medium">Completed:</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {format(job.completedAt, 'PPpp')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>README</CardTitle>
              </CardHeader>
              <CardContent>
                {job.readme ? (
                  <div className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                    {job.readme}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No README provided
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {testResults.length > 0 ? (
            <div className="grid gap-4">
              {testResults.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        {result.device}
                      </CardTitle>
                      <Badge variant={result.status === 'passed' ? 'default' : 'destructive'}>
                        {result.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="font-medium">Duration:</span>
                      <span className="ml-2 text-sm">{result.duration}s</span>
                    </div>

                    {result.logs && (
                      <div>
                        <span className="font-medium">Logs:</span>
                        <div className="mt-1 text-sm bg-muted p-3 rounded-md font-mono">
                          {result.logs}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {result.screenshots && result.screenshots.length > 0 && (
                        <Button variant="outline" size="sm">
                          <ImageIcon className="h-4 w-4 mr-1" />
                          Screenshots ({result.screenshots.length})
                        </Button>
                      )}
                      {result.videoUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={result.videoUrl} target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4 mr-1" />
                            Watch Video
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  {job.status === 'completed' ? 'No test results available' : 'Test results will appear here once testing is complete'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="report" className="space-y-4">
          {job.report ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{job.report.summary}</p>
                </CardContent>
              </Card>

              {job.report.issues && job.report.issues.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Issues Found ({job.report.issues.length})</CardTitle>
                    <CardDescription>
                      AI-detected issues and recommended fixes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {job.report.issues.map((issue, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{issue.title}</h4>
                          <Badge variant={getSeverityColor(issue.severity) as any}>
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                        <div className="mt-3">
                          <span className="font-medium text-sm">Recommended Fix:</span>
                          <p className="text-sm mt-1 bg-green-50 dark:bg-green-900/10 p-3 rounded-md">
                            {issue.fix}
                          </p>
                        </div>
                        {issue.device && (
                          <div className="text-xs text-muted-foreground">
                            Device: {issue.device}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">No Issues Found!</p>
                    <p className="text-muted-foreground">Your app appears to be working well across all tested devices.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {job.status === 'completed' ? 'AI report generation failed' : 'AI report will be generated once testing is complete'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {job.devices.map((deviceId, index) => {
              const device = getDeviceById(deviceId);
              const testResult = testResults.find(r => r.device.includes(device?.name || deviceId));

              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        {device?.name || deviceId}
                      </span>
                      {testResult && (
                        <Badge variant={testResult.status === 'passed' ? 'default' : 'destructive'}>
                          {testResult.status}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {device && (
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="font-medium">Manufacturer:</span>
                          <span className="ml-2">{device.manufacturer}</span>
                        </div>
                        <div>
                          <span className="font-medium">Android:</span>
                          <span className="ml-2">{device.androidVersion} (API {device.apiLevel})</span>
                        </div>
                        <div>
                          <span className="font-medium">Screen:</span>
                          <span className="ml-2">{device.screenSize} ({device.resolution})</span>
                        </div>
                      </div>
                    )}
                    {testResult && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm">
                          <span className="font-medium">Duration:</span>
                          <span className="ml-2">{testResult.duration}s</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
