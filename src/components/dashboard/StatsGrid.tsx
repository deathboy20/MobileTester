"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, Percent, FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Job } from "@/lib/types";
import { useMemo } from "react";


export function StatsGrid() {
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
  
  const statsData = useMemo(() => {
    if (!jobs) {
      return {
        activeJobs: 0,
        passRate: 0,
        reportsGenerated: 0
      };
    }
    const runningJobs = jobs.filter(job => job.status === 'running' || job.status === 'queued').length;
    const completedJobs = jobs.filter(job => job.status === 'completed');
    const failedJobs = jobs.filter(job => job.status === 'failed');
    const totalFinished = completedJobs.length + failedJobs.length;
    const passRate = totalFinished > 0 ? Math.round((completedJobs.length / totalFinished) * 100) : 0;
    const reportsGenerated = jobs.filter(job => job.report).length;

    return {
      activeJobs: runningJobs,
      passRate,
      reportsGenerated
    };
  }, [jobs]);

  const stats = [
    { title: "Active Jobs", value: statsData.activeJobs.toString(), icon: Package, progress: (statsData.activeJobs / 10) * 100, color: "bg-primary" },
    { title: "Pass Rate", value: `${statsData.passRate}%`, icon: Percent, badge: statsData.passRate > 90 ? "Excellent" : "Good", color: "bg-green-500" },
    { title: "Reports Gen.", value: statsData.reportsGenerated.toString(), icon: FileText, color: "bg-sky-500" },
  ];

  if (isLoading) {
    return (
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20" />
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            </CardHeader>
            <CardContent>
              <div className="h-7 bg-muted rounded w-12" />
              <div className="h-2 bg-muted rounded w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.progress !== undefined ? (
                <Progress value={stat.progress} className="mt-2 h-2" />
              ) : stat.badge ? (
                <Badge variant="outline" className="mt-2">{stat.badge}</Badge>
              ) : (
                <p className="text-xs text-muted-foreground mt-2">&nbsp;</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
