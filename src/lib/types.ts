import type { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  email: string | null;
  name: string | null;
  photoURL?: string | null;
  createdAt?: string;
};

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed';

export type JobIssue = {
  desc: string;
  fix: string;
  device: string;
};

export type JobReport = {
  summary: string;
  issues?: JobIssue[];
};

export type Job = {
  id: string;
  userId: string;
  apkUrl: string;
  readme?: string;
  devices: string[];
  status: JobStatus;
  report?: JobReport;
  duration?: number;
  screenshots?: Record<string, string>;
  createdAt: string;
};

export type Device = {
  id: string;
  name: string;
  os: string;
  api: number;
};
