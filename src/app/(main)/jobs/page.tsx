import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Job, JobStatus } from "@/lib/types"
import { MoreHorizontal, FileDown, Eye, ListFilter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import Link from "next/link"
import { UploadDialog } from "@/components/upload/UploadDialog"

const statusColors: Record<JobStatus, string> = {
  queued: "bg-gray-500",
  running: "bg-blue-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
};

const allMockJobs: Job[] = [
  { id: "job_2a3f4b", userId: "user1", apkUrl: "", devices: ["Pixel 8", "Galaxy S24"], status: "completed", duration: 320, createdAt: new Date(Date.now() - 3600000), report: { summary: 'All tests passed.' } },
  { id: "job_9c8d7e", userId: "user1", apkUrl: "", devices: ["Pixel 8"], status: "running", createdAt: new Date(Date.now() - 600000) },
  { id: "job_5g6h7i", userId: "user1", apkUrl: "", devices: ["Moto G Stylus", "Pixel 7a"], status: "failed", duration: 150, createdAt: new Date(Date.now() - 86400000), report: { summary: '2 tests failed.' } },
  { id: "job_1j2k3l", userId: "user1", apkUrl: "", devices: ["Pixel Fold 2"], status: "queued", createdAt: new Date(Date.now() - 30000) },
  { id: "job_8m9n0o", userId: "user1", apkUrl: "", devices: ["Galaxy S23", "OnePlus 12", "Xiaomi 14"], status: "completed", duration: 450, createdAt: new Date(Date.now() - 172800000), report: { summary: 'All tests passed with minor warnings.' } },
  { id: "job_p4q5r6", userId: "user1", apkUrl: "", devices: ["Pixel 6", "Nothing Phone (2)"], status: "completed", duration: 280, createdAt: new Date(Date.now() - 259200000), report: { summary: 'All tests passed.' } },
  { id: "job_s7t8u9", userId: "user1", apkUrl: "", devices: ["Galaxy Tab S9"], status: "failed", duration: 180, createdAt: new Date(Date.now() - 345600000), report: { summary: 'UI layout issues on tablet.' } },
  { id: "job_v0w1x2", userId: "user1", apkUrl: "", devices: ["Asus ROG Phone 8"], status: "running", createdAt: new Date(Date.now() - 120000) },
];


export default function JobsPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">All Jobs</h1>
            <p className="text-muted-foreground">
              Browse and manage all your test runs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Completed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Running</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Failed</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Queued</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <UploadDialog />
          </div>
        </div>

      <Card>
        <CardContent className="pt-6">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allMockJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <Link href={`/jobs/${job.id}`} className="hover:underline">
                      {job.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={`capitalize text-white ${statusColors[job.status]}`}>{job.status}</Badge>
                  </TableCell>
                  <TableCell>{job.devices.length} devices</TableCell>
                  <TableCell>{job.duration ? `${job.duration}s` : "N/A"}</TableCell>
                  <TableCell>{format(job.createdAt, "PPpp")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                           <Link href={`/jobs/${job.id}`}><Eye className="mr-2 h-4 w-4" /> View Details</Link>
                        </DropdownMenuItem>
                        {job.report && (
                          <DropdownMenuItem>
                            <FileDown className="mr-2 h-4 w-4" />
                            Download Report
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
