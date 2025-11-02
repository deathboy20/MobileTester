'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileDown, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from "framer-motion";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Job } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

const reportImages = [
  PlaceHolderImages.find((img) => img.id === "report-preview-1")!,
  PlaceHolderImages.find((img) => img.id === "report-preview-2")!,
];

export default function ReportsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const reportsQuery = useMemoFirebase(
    () =>
      user
        ? query(collection(firestore, 'jobs'), where('userId', '==', user.uid), where('report', '!=', null))
        : null,
    [firestore, user]
  );

  const { data: reports, isLoading } = useCollection<Job>(reportsQuery);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Access and download all your generated test reports.
        </p>
      </div>

       {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
       ) : reports && reports.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reports.map((report, index) => {
            const image = reportImages[index % reportImages.length];
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <Image
                      src={image.imageUrl}
                      alt="Report preview"
                      width={400}
                      height={565}
                      data-ai-hint={image.imageHint}
                      className="w-full aspect-[2/2.8] object-cover"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-base truncate">
                      Report for {report.id.substring(0, 10)}...
                    </CardTitle>
                    <CardDescription>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/jobs/${report.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Job
                      </Link>
                    </Button>
                    <Button size="sm">
                      <FileDown className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
       ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No Reports Yet</h2>
            <p className="text-muted-foreground mt-2">
                Completed jobs with generated reports will appear here.
            </p>
        </div>
       )}
    </div>
  );
}
