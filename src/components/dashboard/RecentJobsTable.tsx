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
import { MoreHorizontal, FileDown, Eye } from "lucide-react"
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

const statusColors: Record<JobStatus, string> = {
  queued: "bg-gray-500",
  running: "bg-blue-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
}

const mockJobs: Job[] = [
  { id: "job_2a3f4b", userId: "user1", apkUrl: "", devices: ["Pixel 8", "Galaxy S24"], status: "completed", duration: 320, createdAt: new Date(Date.now() - 3600000), report: { summary: 'All tests passed.' } },
  { id: "job_9c8d7e", userId: "user1", apkUrl: "", devices: ["Pixel 8"], status: "running", createdAt: new Date(Date.now() - 600000) },
  { id: "job_5g6h7i", userId: "user1", apkUrl: "", devices: ["Moto G Stylus", "Pixel 7a"], status: "failed", duration: 150, createdAt: new Date(Date.now() - 86400000), report: { summary: '2 tests failed.' } },
  { id: "job_1j2k3l", userId: "user1", apkUrl: "", devices: ["Pixel Fold 2"], status: "queued", createdAt: new Date(Date.now() - 30000) },
  { id: "job_8m9n0o", userId: "user1", apkUrl: "", devices: ["Galaxy S23", "OnePlus 12", "Xiaomi 14"], status: "completed", duration: 450, createdAt: new Date(Date.now() - 172800000), report: { summary: 'All tests passed with minor warnings.' } },
]

export function RecentJobsTable() {
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
        {mockJobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell className="font-medium">
              <Link href={`/jobs/${job.id}`} className="hover:underline">
                {job.id}
              </Link>
            </TableCell>
            <TableCell>
              <Badge className={`capitalize text-white ${statusColors[job.status]}`}>{job.status}</Badge>
            </TableCell>
            <TableCell>{job.devices.join(", ")}</TableCell>
            <TableCell>{job.duration ? `${job.duration}s` : "N/A"}</TableCell>
            <TableCell>{formatDistanceToNow(job.createdAt, { addSuffix: true })}</TableCell>
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
  )
}
