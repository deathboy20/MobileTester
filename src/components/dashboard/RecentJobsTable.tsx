"use client"

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
import { MoreHorizontal, FileDown, Eye, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase"
import { collection, limit, query, where } from "firebase/firestore"

const statusColors: Record<JobStatus, string> = {
  queued: "bg-gray-500",
  running: "bg-blue-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
}

export function RecentJobsTable() {
  const { user } = useUser();
  const firestore = useFirestore();

  const jobsQuery = useMemoFirebase(
    () =>
      user
        ? query(collection(firestore, 'jobs'), where('userId', '==', user.uid), limit(5))
        : null,
    [firestore, user]
  );
  const { data: jobs, isLoading } = useCollection<Job>(jobsQuery);

  return (
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
              <TableCell>{job.devices.join(", ")}</TableCell>
              <TableCell>{job.duration ? `${job.duration}s` : "N/A"}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</TableCell>
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
                No recent jobs. Start a new test to see it here.
              </TableCell>
            </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
