
'use server';
/**
 * @fileOverview An AI-powered orchestration agent that plans tasks across multiple tools.
 *
 * - orchestrateTask - A function that analyzes a user's goal and proposes a plan involving relevant tools.
 * - OrchestrateTaskInput - The input type for the orchestrateTask function.
 * - OrchestrateTaskOutput - The return type for the orchestrateTask function.
 * - ToolInfo - A simplified tool representation for the AI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ToolInfoSchema = z.object({
  id: z.string().describe('The unique identifier for the tool.'),
  name: z.string().describe('The display name of the tool.'),
  description: z.string().describe('A brief description of what the tool does.'),
});
export type ToolInfo = z.infer<typeof ToolInfoSchema>;

const OrchestrateTaskInputSchema = z.object({
  userGoal: z.string().describe('The high-level goal or task described by the user.'),
  availableTools: z.array(ToolInfoSchema).describe('A list of available tools with their IDs, names, and descriptions.'),
});
export type OrchestrateTaskInput = z.infer<typeof OrchestrateTaskInputSchema>;

const OrchestrateTaskOutputSchema = z.object({
  planSteps: z.array(z.string()).describe('A list of textual steps the agent proposes to achieve the goal. Each step should clearly mention which tool might be used, if any.'),
  identifiedToolIds: z.array(z.string()).describe('An array of tool IDs identified as relevant to the plan. The order might suggest a sequence.'),
  clarificationQuestion: z.string().optional().describe('A question the agent asks if the user_s goal is ambiguous or needs more details. The agent should prefer to ask for clarification if the goal is too vague to make a concrete plan.'),
  agentThoughtProcess: z.string().optional().describe('A brief, user-friendly explanation of the agent_s reasoning or how it arrived at the plan.'),
});
export type OrchestrateTaskOutput = z.infer<typeof OrchestrateTaskOutputSchema>;

export async function orchestrateTask(input: OrchestrateTaskInput): Promise<OrchestrateTaskOutput> {
  return orchestrateTaskFlow(input);
}

const orchestrateTaskPrompt = ai.definePrompt({
  name: 'orchestrateTaskPrompt',
  input: {schema: OrchestrateTaskInputSchema},
  output: {schema: OrchestrateTaskOutputSchema},
  prompt: `You are an Orchestration Agent for Agent-Computer. Your role is to help users achieve complex goals by planning tasks that may involve one or more specialized tools. You do NOT execute the tasks yourself, but you create a plan and identify the tools.

User's Goal:
{{{userGoal}}}

Available Tools:
{{#each availableTools}}
- ID: {{id}}, Name: "{{name}}", Description: "{{description}}"
{{/each}}

Your Task:
1.  Analyze the user's goal.
2.  Based on the goal and the available tools, identify up to 3 relevant tools that can help achieve this goal. If no specific tools seem directly relevant but the task is general (e.g., 'write a poem'), suggest a general approach or using a generic tool like a Document Processor.
3.  Formulate a concise, step-by-step plan (max 5 steps). Each step should be actionable. If a tool is relevant for a step, mention it.
4.  If the user's goal is too vague, ambiguous, or requires information you don't have (e.g., specific dates, preferences), prioritize asking a clear clarification question instead of making too many assumptions.
5.  Provide a brief, user-friendly "Thought Process" (1-2 sentences) explaining your reasoning for the plan and tool selection.
6.  Populate the 'identifiedToolIds' array with the IDs of the tools you've chosen, in the order they might be used if sequential.
7.  Return the plan, identified tool IDs, an optional clarification question, and your thought process.

Example Output for a clear goal:
{
  "planSteps": [
    "1. Use 'Document Processor' to draft the initial report outline.",
    "2. Utilize 'Web Navigator' to research market statistics for section 3.",
    "3. Incorporate research into the draft using 'Document Processor'."
  ],
  "identifiedToolIds": ["document-processor", "web-navigator", "document-processor"],
  "agentThoughtProcess": "The user wants to create a report. I'll start with drafting in the Document Processor, then use the Web Navigator for research, and finally update the document."
}

Example Output for a vague goal:
{
  "planSteps": [],
  "identifiedToolIds": [],
  "clarificationQuestion": "To help you organize your Tokyo trip, could you please provide the dates for your travel?",
  "agentThoughtProcess": "The user's goal is to plan a trip, which is broad. I need specific dates to proceed with planning flights and accommodation."
}

If the goal is very simple and seems to only require one tool, create a short plan and identify that tool.
Focus on planning and tool identification, not execution.
`,
});

const orchestrateTaskFlow = ai.defineFlow(
  {
    name: 'orchestrateTaskFlow',
    inputSchema: OrchestrateTaskInputSchema,
    outputSchema: OrchestrateTaskOutputSchema,
  },
  async input => {
    const {output} = await orchestrateTaskPrompt(input);
    if (!output) {
      // Fallback or error handling if AI output is empty
      return {
        planSteps: ["I'm having trouble formulating a plan right now. Could you try rephrasing your goal?"],
        identifiedToolIds: [],
        agentThoughtProcess: "Encountered an unexpected issue generating the plan."
      };
    }
    return output;
  }
);
