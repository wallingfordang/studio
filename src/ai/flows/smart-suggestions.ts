// 'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing smart suggestions to users based on the currently active tool in the Space.
 *
 * - getSmartSuggestions - A function that returns smart suggestions based on the active tool.
 * - SmartSuggestionsInput - The input type for the getSmartSuggestions function.
 * - SmartSuggestionsOutput - The return type for the getSmartSuggestions function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSuggestionsInputSchema = z.object({
  activeTool: z
    .string()
    .describe('The name of the currently active tool in the Space.'),
});
export type SmartSuggestionsInput = z.infer<typeof SmartSuggestionsInputSchema>;

const SmartSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of smart suggestions for the user.'),
});
export type SmartSuggestionsOutput = z.infer<typeof SmartSuggestionsOutputSchema>;

export async function getSmartSuggestions(input: SmartSuggestionsInput): Promise<SmartSuggestionsOutput> {
  return smartSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSuggestionsPrompt',
  input: {schema: SmartSuggestionsInputSchema},
  output: {schema: SmartSuggestionsOutputSchema},
  prompt: `You are an AI assistant that provides smart suggestions to users based on the currently active tool in the Space.

  The suggestions should be related to the tool and help the user discover new functionalities and optimize their workflow.

  Current Tool: {{{activeTool}}}

  Provide 3-5 suggestions in bullet point format.

  Example Output:
  {
    "suggestions": [
      "Suggestion 1",
      "Suggestion 2",
      "Suggestion 3",
      "Suggestion 4",
      "Suggestion 5"
    ]
  }
  `,
});

const smartSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartSuggestionsFlow',
    inputSchema: SmartSuggestionsInputSchema,
    outputSchema: SmartSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
