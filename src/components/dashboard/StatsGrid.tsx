"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, Percent, FileText } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { title: "Active Jobs", value: "3", icon: Package, progress: 30, color: "bg-primary" },
  { title: "Pass Rate", value: "92%", icon: Percent, badge: "Excellent", color: "bg-green-500" },
  { title: "Reports Gen.", value: "12", icon: FileText, color: "bg-sky-500" },
];

export function StatsGrid() {
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
                <p className="text-xs text-muted-foreground mt-2">+2 since last hour</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
