import { StatusTimeline } from "@/components/job/StatusTimeline"
import { DeviceGrid } from "@/components/job/DeviceGrid"
import { AIReporter } from "@/components/job/AIReporter"
import type { Job, JobStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data for a single job
const mockJob: Job = {
  id: "job_5g6h7i",
  userId: "user1",
  apkUrl: "",
  readme: "This build includes the new user profile screen. Please focus testing on that area.",
  devices: ["Moto G Stylus", "Pixel 7a"],
  status: "failed",
  duration: 150,
  createdAt: new Date(Date.now() - 86400000),
  report: undefined, // Let the AI generate it
  screenshots: {
    "Moto G Stylus": "screenshot1.png",
    "Pixel 7a": "screenshot2.png",
  }
};

const mockDeviceStatuses: { name: string; status: JobStatus }[] = [
    { name: "Moto G Stylus", status: 'completed' },
    { name: "Pixel 7a", status: 'failed' }
];

// Mock logs for AI analysis
const mockLogs = `
Test run on device: Pixel 7a
Starting test suite: com.example.app.UserProfileTests
...
Test: testProfilePictureUpload - PASSED
Test: testUsernameUpdate - PASSED
Test: testBioUpdate - FAILED
java.lang.NullPointerException: Attempt to invoke virtual method 'void android.widget.TextView.setText(java.lang.CharSequence)' on a null object reference
at com.example.app.ProfileFragment.updateBio(ProfileFragment.java:123)
...
Test run finished. 1 of 3 tests failed.
`;

export default function JobDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch job data based on params.id
  const job = mockJob;

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Jobs
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Job Details: <span className="text-primary">{job.id}</span>
        </h1>
        <p className="text-muted-foreground">
          Created on {job.createdAt.toLocaleString()}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Test Progress</h2>
          <StatusTimeline status={job.status} />
          {job.readme && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">README</h3>
              <div className="prose prose-sm dark:prose-invert bg-muted p-4 rounded-lg">
                <p>{job.readme}</p>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Device Results</h2>
            <DeviceGrid devices={mockDeviceStatuses} />
          </div>
          <div>
            <AIReporter jobId={job.id} logs={mockLogs} />
          </div>
        </div>
      </div>
    </div>
  );
}
