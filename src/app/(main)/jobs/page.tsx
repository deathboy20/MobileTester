'use client';

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
import { MoreHorizontal, FileDown, Eye, ListFilter, Loader2 } from "lucide-react"
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
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase"
import { collection, query, where } from "firebase/firestore"

const statusColors: Record<JobStatus, string> = {
  queued: "bg-gray-500",
  running: "bg-blue-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
};

export default function JobsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const jobsQuery = useMemoFirebase(
    () =>
      user
        ? query(collection(firestore, 'jobs'), where('userId', '==', user.uid))
        : null,
    [firestore, user]
  );

  const { data: jobs, isLoading } = useCollection<Job>(jobsQuery);

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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  </TableCell>
                </TableRow>
              ) : jobs && jobs.length > 0 ? (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      <Link href={`/jobs/${job.id}`} className="hover:underline">
                        {job.id.substring(0, 10)}...
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={`capitalize text-white ${statusColors[job.status]}`}>{job.status}</Badge>
                    </TableCell>
                    <TableCell>{job.devices.length} devices</TableCell>
                    <TableCell>{job.duration ? `${job.duration}s` : "N/A"}</TableCell>
                    <TableCell>{format(new Date(job.createdAt), "PPpp")}</TableCell>
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
                ))
              ) : (
                 <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No jobs found. Start a new test to begin.
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
