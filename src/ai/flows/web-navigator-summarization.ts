'use server';

/**
 * @fileOverview A web navigator summarization AI agent.
 *
 * - summarizeWebpage - A function that handles the webpage summarization process.
 * - SummarizeWebpageInput - The input type for the summarizeWebpage function.
 * - SummarizeWebpageOutput - The return type for the summarizeWebpage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeWebpageInputSchema = z.object({
  url: z.string().describe('The URL of the webpage to summarize.'),
});
export type SummarizeWebpageInput = z.infer<typeof SummarizeWebpageInputSchema>;

const SummarizeWebpageOutputSchema = z.object({
  summary: z.string().describe('The summary of the webpage.'),
});
export type SummarizeWebpageOutput = z.infer<typeof SummarizeWebpageOutputSchema>;

export async function summarizeWebpage(input: SummarizeWebpageInput): Promise<SummarizeWebpageOutput> {
  return summarizeWebpageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeWebpagePrompt',
  input: {schema: SummarizeWebpageInputSchema},
  output: {schema: SummarizeWebpageOutputSchema},
  prompt: `You are an expert web content summarizer.

You will receive a URL of a webpage, and your job is to summarize the content of the webpage.

URL: {{{url}}}`,
});

const summarizeWebpageFlow = ai.defineFlow(
  {
    name: 'summarizeWebpageFlow',
    inputSchema: SummarizeWebpageInputSchema,
    outputSchema: SummarizeWebpageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
