import type { Timestamp } from "firebase/firestore";

export type User = {
  id: string;
  email: string | null;
  name: string | null;
  photoURL?: string | null;
  createdAt: Date;
};

export type JobStatus = "queued" | "running" | "completed" | "failed";

export type JobIssue = {
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  fix: string;
  device?: string;
};

export type JobReport = {
  summary: string;
  issues: JobIssue[];
};

export type Job = {
  id: string;
  userId: string;
  apkUrl: string;
  readme: string;
  devices: string[];
  status: JobStatus;
  logs?: string;
  report?: JobReport;
  videos?: { device: string; url: string }[];
  duration?: number;
  createdAt: Date;
  completedAt?: Date;
};

export type Device = {
  id: string;
  name: string;
  manufacturer: string;
  androidVersion: string;
  apiLevel: number;
  screenSize: string;
  resolution: string;
  popular: boolean;
};

export type TestResult = {
  device: string;
  status: "passed" | "failed" | "skipped";
  logs: string;
  screenshots?: string[];
  videoUrl?: string;
  duration: number;
};

export type UploadResponse = {
  success: boolean;
  jobId?: string;
  error?: string;
};
