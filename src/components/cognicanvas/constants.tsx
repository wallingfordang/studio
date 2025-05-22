
import { FileText, Globe, MessageSquare, ImageIcon, ListChecks, Table, Presentation, Code, Gamepad2, Settings, HelpCircle, Brain, Lightbulb, Send } from 'lucide-react';
import type { Tool } from './types';
import { DocumentProcessor } from './tools/document-processor';
import { WebNavigator } from './tools/web-navigator';
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Added for placeholder agent

// Generic placeholder component for tools not yet implemented
const PlaceholderToolComponent: React.FC<{ tool: Tool }> = ({ tool }) => (
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
    component: (props) => <PlaceholderToolComponent {...props} tool={ALL_TOOLS.find(t => t.id === 'comms-hub')!} />,
    category: 'Communication',
  },
  {
    id: 'creative-suite',
    name: 'Creative Suite',
    icon: ImageIcon,
    description: 'Tools for image generation and editing.',
    component: (props) => <PlaceholderToolComponent {...props} tool={ALL_TOOLS.find(t => t.id === 'creative-suite')!} />,
    category: 'Creative',
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    icon: ListChecks,
    description: 'AI-assisted task planning and tracking.',
    component: (props) => <PlaceholderToolComponent {...props} tool={ALL_TOOLS.find(t => t.id === 'task-manager')!} />,
    category: 'Productivity',
  },
  {
    id: 'spreadsheet-tool',
    name: 'Spreadsheet Tool',
    icon: Table,
    description: 'Data organization, calculation, and visualization.',
    component: (props) => <PlaceholderToolComponent {...props} tool={ALL_TOOLS.find(t => t.id === 'spreadsheet-tool')!} />,
    category: 'Productivity',
  },
  {
    id: 'presentation-builder',
    name: 'Presentation Builder',
    icon: Presentation,
    description: 'Create slideshows with AI assistance.',
    component: (props) => <PlaceholderToolComponent {...props} tool={ALL_TOOLS.find(t => t.id === 'presentation-builder')!} />,
    category: 'Productivity',
  },
  {
    id: 'code-editor',
    name: 'Code Editor',
    icon: Code,
    description: 'View and make minor edits to code snippets.',
    component: (props) => <PlaceholderToolComponent {...props} tool={ALL_TOOLS.find(t => t.id === 'code-editor')!} />,
    category: 'Development',
  },
  {
    id: 'game-center',
    name: 'Game Center',
    icon: Gamepad2,
    description: 'Access to casual games.',
    component: (props) => <PlaceholderToolComponent {...props} tool={ALL_TOOLS.find(t => t.id === 'game-center')!} />,
    category: 'Entertainment',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    description: 'Customize your CogniCanvas experience.',
    component: (props) => <PlaceholderToolComponent {...props} tool={ALL_TOOLS.find(t => t.id === 'settings')!} />,
    category: 'System',
  },
];

// Update PlaceholderToolComponent to correctly pass the 'tool' prop
const originalPlaceholderComponent = PlaceholderToolComponent;
const PatchedPlaceholderToolComponent: React.FC<{ tool: Tool }> = ({ tool, ...props }) => {
  // Ensure tool is always defined. If it's somehow undefined, we could render a generic error or default.
  // For this patch, we assume it will be found or the calling code ensures it.
  return originalPlaceholderComponent({ ...props, tool });
};

// Update ALL_TOOLS to use the patched component or ensure tool is passed correctly
ALL_TOOLS.forEach(tool => {
  if (tool.component.name === 'PlaceholderToolComponent' || tool.component.displayName === 'PlaceholderToolComponent') {
    // This is a bit of a hacky way to check; ideally, the component would be passed the tool prop directly.
    // The current structure is (props) => <PlaceholderToolComponent {...props} tool={THE_ACTUAL_TOOL_OBJECT_HERE} />
    // We need to ensure the `tool` prop is correctly passed when PlaceholderToolComponent is invoked.
    // The original component already expects a 'tool' prop. The way it was called was by spreading props,
    // but not explicitly passing the `tool` object itself.

    // Let's correct how PlaceholderToolComponent is assigned in ALL_TOOLS for non-implemented tools
    // This was the problematic part. The component was being assigned as:
    // component: (props) => <PlaceholderToolComponent {...props} />,
    // which means `PlaceholderToolComponent` itself wouldn't receive its `tool` prop.
    // It should be:
    // component: (props) => <PlaceholderToolComponent {...props} tool={the_specific_tool_object} />,
    // The previous diff already corrected this by finding the tool by id.
    // The issue was simply the missing `Send` import.
  }
});
