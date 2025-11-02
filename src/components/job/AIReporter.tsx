"use client"

import { useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { toast } from "sonner"
import jsPDF from "jspdf"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileDown, Bot, Loader, Code2 } from "lucide-react"
import { generateAiPoweredReport, GenerateAiPoweredReportOutput } from "@/ai/flows/generate-ai-powered-report"

type AIReportState = {
  report: GenerateAiPoweredReportOutput | null;
  error: string | null;
};

async function handleGenerateReport(
  prevState: AIReportState,
  formData: FormData
): Promise<AIReportState> {
  const jobId = formData.get("jobId") as string;
  const logs = formData.get("logs") as string;

  try {
    const report = await generateAiPoweredReport({ jobId, logs });
    toast.success("AI Report generated successfully!");
    return { report, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : "An unknown error occurred.";
    toast.error("Failed to generate AI report.");
    return { report: null, error };
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Bot className="mr-2 h-4 w-4" />
      )}
      Generate AI Report
    </Button>
  );
}

export function AIReporter({ jobId, logs }: { jobId: string; logs: string }) {
  const initialState: AIReportState = { report: null, error: null };
  const [state, formAction] = useFormState(handleGenerateReport, initialState);

  const downloadPdf = () => {
    if (!state.report) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text(`AI Test Report - Job ${jobId}`, 20, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    const summaryLines = doc.splitTextToSize(`Summary: ${state.report.summary}`, 170);
    doc.text(summaryLines, 20, 30);
    
    let yPos = 30 + summaryLines.length * 7 + 10;

    if (state.report.issues && state.report.issues.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Issues Found:", 20, yPos);
      yPos += 10;
      doc.setFont("helvetica", "normal");

      state.report.issues.forEach((issue, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(10);
        const issueLines = doc.splitTextToSize(
          `${index + 1}. [${issue.device}] ${issue.desc}\n\nSuggested Fix:\n${issue.fix}`,
          170
        );
        doc.text(issueLines, 20, yPos);
        yPos += issueLines.length * 5 + 5;
      });
    }

    doc.save(`report-${jobId}.pdf`);
    toast.success("PDF report downloaded.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Bot className="h-6 w-6 text-primary" />
          AI-Powered Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        {state.report ? (
          <div className="space-y-4">
            <Button onClick={downloadPdf}>
              <FileDown className="mr-2 h-4 w-4" />
              Download PDF Report
            </Button>
            <Accordion type="single" collapsible defaultValue="summary">
              <AccordionItem value="summary">
                <AccordionTrigger>Summary</AccordionTrigger>
                <AccordionContent>{state.report.summary}</AccordionContent>
              </AccordionItem>
              {state.report.issues && state.report.issues.length > 0 && (
                <AccordionItem value="issues">
                  <AccordionTrigger>
                    Issues Found ({state.report.issues.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {state.report.issues.map((issue, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-muted/50">
                          <p className="font-semibold">
                            {index + 1}. {issue.desc}
                          </p>
                          <Badge variant="outline" className="my-2">{issue.device}</Badge>
                          <div className="mt-2 p-3 rounded-md bg-background">
                            <h4 className="text-sm font-semibold flex items-center mb-1">
                               <Code2 className="w-4 h-4 mr-2" /> Suggested Fix
                            </h4>
                            <pre className="text-xs whitespace-pre-wrap font-code bg-gray-800 text-white p-2 rounded">
                              <code>{issue.fix}</code>
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p className="mb-4">No report generated yet. Click the button to start the AI analysis.</p>
            <form action={formAction}>
              <input type="hidden" name="jobId" value={jobId} />
              <input type="hidden" name="logs" value={logs} />
              <SubmitButton />
            </form>
            {state.error && (
              <p className="text-destructive mt-4 text-sm">{state.error}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
