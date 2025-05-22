'use server';

/**
 * @fileOverview An AI-assisted drafting flow for generating initial document drafts.
 *
 * - aiAssistedDrafting - A function that generates a document draft based on a user prompt.
 * - AiAssistedDraftingInput - The input type for the aiAssistedDrafting function.
 * - AiAssistedDraftingOutput - The return type for the aiAssistedDrafting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAssistedDraftingInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the desired document draft.'),
});
export type AiAssistedDraftingInput = z.infer<typeof AiAssistedDraftingInputSchema>;

const AiAssistedDraftingOutputSchema = z.object({
  draft: z.string().describe('The generated document draft.'),
});
export type AiAssistedDraftingOutput = z.infer<typeof AiAssistedDraftingOutputSchema>;

export async function aiAssistedDrafting(input: AiAssistedDraftingInput): Promise<AiAssistedDraftingOutput> {
  return aiAssistedDraftingFlow(input);
}

const aiAssistedDraftingPrompt = ai.definePrompt({
  name: 'aiAssistedDraftingPrompt',
  input: {schema: AiAssistedDraftingInputSchema},
  output: {schema: AiAssistedDraftingOutputSchema},
  prompt: `You are an AI assistant helping a user draft a document.
  Based on the user's prompt, generate an initial draft of the document.
  Prompt: {{{prompt}}}`,  
});

const aiAssistedDraftingFlow = ai.defineFlow(
  {
    name: 'aiAssistedDraftingFlow',
    inputSchema: AiAssistedDraftingInputSchema,
    outputSchema: AiAssistedDraftingOutputSchema,
  },
  async input => {
    const {output} = await aiAssistedDraftingPrompt(input);
    return output!;
  }
);
