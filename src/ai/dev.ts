
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-assisted-drafting.ts';
import '@/ai/flows/smart-suggestions.ts';
import '@/ai/flows/web-navigator-summarization.ts';
import '@/ai/flows/orchestrate-task-flow.ts'; // Added new flow
