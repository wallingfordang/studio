
import { FileText, Globe, MessageSquare, ImageIcon, ListChecks, Table, Presentation, Code, Gamepad2, Settings, HelpCircle, Brain, Lightbulb, Send } from 'lucide-react';
import type { Tool, ToolProps } from './types';
import { DocumentProcessor } from './tools/document-processor';
import { WebNavigator } from './tools/web-navigator';
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Generic placeholder component for tools not yet implemented
// Changed to accept ToolProps for consistency, though it primarily uses 'tool'.
const PlaceholderToolComponent: React.FC<ToolProps> = ({ tool }) => (
  <div className="h-full flex flex-col shadow-xl rounded-lg overflow-hidden border-border bg-card">
    <div className="bg-card border-b p-4">
      <h2 className="text-lg font-semibold flex items-center text-card-foreground">
        <tool.icon className="mr-2 h-5 w-5 text-primary" />
        {tool.name}
      </h2>
    </div>
    <div className="flex-grow flex flex-row overflow-hidden">
      <div className="flex-grow flex flex-col items-center justify-center h-full p-8 bg-card text-muted-foreground">
        <HelpCircle className="w-16 h-16 mb-4 text-primary/30" />
        <h2 className="text-xl font-semibold mb-2 text-foreground">{tool.name}</h2>
        <p className="text-center">This tool is under development. Stay tuned!</p>
      </div>
      {/* Placeholder Agent Stream + Smart Suggestions part */}
      <div className="w-[340px] md:w-[380px] lg:w-[420px] border-l border-border flex flex-col bg-sidebar text-sidebar-foreground shrink-0">
        {/* Placeholder Agent Stream */}
        <div className="flex-grow p-3 space-y-3 overflow-auto">
          <div className="flex justify-start mb-2">
            <div className="flex items-end gap-2 max-w-[85%]">
              <Avatar className="h-7 w-7 self-start border border-border">
                <AvatarFallback className="bg-muted">
                  <Brain className="h-3.5 w-3.5 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="p-2.5 rounded-xl shadow-sm text-sm bg-card text-card-foreground rounded-bl-none border border-border">
                Agent for {tool.name} is ready. How can I help?
              </div>
            </div>
          </div>
           <div className="text-xs text-muted-foreground italic w-full text-center py-1 px-2">
            Interaction with this agent is simulated.
          </div>
        </div>
         <div className="border-t border-border p-3 space-y-2.5 bg-inherit">
            <div className="flex items-center gap-2">
                <textarea
                    placeholder={`Message ${tool.name} AI... (Simulated)`}
                    rows={1}
                    className="flex-grow resize-none min-h-[40px] max-h-[120px] text-sm bg-card focus-visible:ring-primary rounded-md p-2 border border-input"
                    disabled
                />
                <button className="h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-50 cursor-not-allowed">
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
        {/* Placeholder Smart Suggestions */}
        <div className="p-3 border-t border-border bg-inherit">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold flex items-center text-foreground">
              <Lightbulb className="mr-1.5 h-4 w-4 text-primary" />
              Smart Suggestions
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">Suggestions for {tool.name} will appear here. (Simulated)</p>
        </div>
      </div>
    </div>
  </div>
);


export const ALL_TOOLS: Tool[] = [
  {
    id: 'document-processor',
    name: 'Document Processor',
    icon: FileText,
    description: 'Write, edit, and format text with AI assistance.',
    component: DocumentProcessor,
    category: 'Productivity',
  },
  {
    id: 'web-navigator',
    name: 'Web Navigator',
    icon: Globe,
    description: 'AI-enhanced browser for summaries and information extraction.',
    component: WebNavigator,
    category: 'Productivity',
  },
  {
    id: 'comms-hub',
    name: 'Comms Hub',
    icon: MessageSquare,
    description: 'Integrated email, calendar, and messenger.',
    component: PlaceholderToolComponent, // Simplified: PlaceholderToolComponent now takes ToolProps
    category: 'Communication',
  },
  {
    id: 'creative-suite',
    name: 'Creative Suite',
    icon: ImageIcon,
    description: 'Tools for image generation and editing.',
    component: PlaceholderToolComponent,
    category: 'Creative',
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    icon: ListChecks,
    description: 'AI-assisted task planning and tracking.',
    component: PlaceholderToolComponent,
    category: 'Productivity',
  },
  {
    id: 'spreadsheet-tool',
    name: 'Spreadsheet Tool',
    icon: Table,
    description: 'Data organization, calculation, and visualization.',
    component: PlaceholderToolComponent,
    category: 'Productivity',
  },
  {
    id: 'presentation-builder',
    name: 'Presentation Builder',
    icon: Presentation,
    description: 'Create slideshows with AI assistance.',
    component: PlaceholderToolComponent,
    category: 'Productivity',
  },
  {
    id: 'code-editor',
    name: 'Code Editor',
    icon: Code,
    description: 'View and make minor edits to code snippets.',
    component: PlaceholderToolComponent,
    category: 'Development',
  },
  {
    id: 'game-center',
    name: 'Game Center',
    icon: Gamepad2,
    description: 'Access to casual games.',
    component: PlaceholderToolComponent,
    category: 'Entertainment',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    description: 'Customize your CogniCanvas experience.',
    component: PlaceholderToolComponent,
    category: 'System',
  },
];

// Removed the previous patching logic as it's no longer needed with the direct component assignment
// and correct prop typing (ToolProps) for PlaceholderToolComponent.
