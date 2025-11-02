'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentJobsTable } from "@/components/dashboard/RecentJobsTable";
import { UploadDialog } from "@/components/upload/UploadDialog";
import { useUser } from "@/firebase";

export default function DashboardPage() {
  const { user } = useUser();
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName || 'tester'}! Here's a snapshot of your testing activity.
          </p>
        </div>
        <UploadDialog />
      </div>

      <StatsGrid />
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
          <CardDescription>An overview of your most recent test runs.</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentJobsTable />
        </CardContent>
      </Card>
    </div>
  );
}
