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
import { FileDown, Eye } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from "framer-motion";

const mockReports = [
  { jobId: "job_2a3f4b", date: "2 days ago", devices: 2, status: "Completed" },
  { jobId: "job_5g6h7i", date: "1 day ago", devices: 2, status: "Failed" },
  { jobId: "job_8m9n0o", date: "3 days ago", devices: 3, status: "Completed" },
  { jobId: "job_p4q5r6", date: "4 days ago", devices: 2, status: "Completed" },
];

const reportImages = [
  PlaceHolderImages.find((img) => img.id === "report-preview-1")!,
  PlaceHolderImages.find((img) => img.id === "report-preview-2")!,
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Access and download all your generated test reports.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockReports.map((report, index) => {
          const image = reportImages[index % reportImages.length];
          return (
            <motion.div
              key={report.jobId}
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
                    Report for {report.jobId}
                  </CardTitle>
                  <CardDescription>{report.date}</CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/jobs/${report.jobId}`}>
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
    </div>
  );
}
