'use server';

/**
 * @fileOverview Generates an AI-powered report summarizing test results and suggesting bug fixes.
 *
 * - generateAiPoweredReport - A function that generates the AI-powered report.
 * - GenerateAiPoweredReportInput - The input type for the generateAiPoweredReport function.
 * - GenerateAiPoweredReportOutput - The return type for the generateAiPoweredReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiPoweredReportInputSchema = z.object({
  logs: z.string().describe('The logs from the Android tests.'),
  jobId: z.string().describe('The ID of the job.'),
});
export type GenerateAiPoweredReportInput = z.infer<typeof GenerateAiPoweredReportInputSchema>;

const GenerateAiPoweredReportOutputSchema = z.object({
  summary: z.string().describe('A summary of the test results.'),
  issues: z
    .array(
      z.object({
        desc: z.string().describe('A description of the issue.'),
        fix: z.string().describe('A suggested fix for the issue.'),
        device: z.string().describe('The device on which the issue occurred.'),
      })
    )
    .optional()
    .describe('A list of issues found during the tests.'),
});
export type GenerateAiPoweredReportOutput = z.infer<typeof GenerateAiPoweredReportOutputSchema>;

export async function generateAiPoweredReport(
  input: GenerateAiPoweredReportInput
): Promise<GenerateAiPoweredReportOutput> {
  return generateAiPoweredReportFlow(input);
}

const analyzeWithGroqPrompt = ai.definePrompt({
  name: 'analyzeWithGroqPrompt',
  prompt: `Analyze Android test logs: {{{logs}}}. Output JSON: {summary: string, issues: [{desc: string, fix: string, device: string}]}`,
});

const generateAiPoweredReportFlow = ai.defineFlow(
  {
    name: 'generateAiPoweredReportFlow',
    inputSchema: GenerateAiPoweredReportInputSchema,
    outputSchema: GenerateAiPoweredReportOutputSchema,
  },
  async input => {
    const {output} = await analyzeWithGroqPrompt(input);
    return output!;
  }
);
