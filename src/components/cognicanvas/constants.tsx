import { FileText, Globe, MessageSquare, ImageIcon, ListChecks, Table, Presentation, Code, Gamepad2, Settings, HelpCircle } from 'lucide-react';
import type { Tool } from './types';
import { DocumentProcessor } from './tools/document-processor';
import { WebNavigator } from './tools/web-navigator';
import React from 'react'; // Import React for JSX in placeholder components

// Generic placeholder component for tools not yet implemented
const PlaceholderToolComponent: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 bg-card border border-dashed rounded-lg text-muted-foreground">
    <HelpCircle className="w-16 h-16 mb-4 text-primary/30" />
    <h2 className="text-xl font-semibold mb-2 text-foreground">{name}</h2>
    <p className="text-center">This tool is under development. Stay tuned!</p>
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
    component: () => <PlaceholderToolComponent name="Comms Hub" />,
    category: 'Communication',
  },
  {
    id: 'creative-suite',
    name: 'Creative Suite',
    icon: ImageIcon,
    description: 'Tools for image generation and editing.',
    component: () => <PlaceholderToolComponent name="Creative Suite" />,
    category: 'Creative',
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    icon: ListChecks,
    description: 'AI-assisted task planning and tracking.',
    component: () => <PlaceholderToolComponent name="Task Manager" />,
    category: 'Productivity',
  },
  {
    id: 'spreadsheet-tool',
    name: 'Spreadsheet Tool',
    icon: Table,
    description: 'Data organization, calculation, and visualization.',
    component: () => <PlaceholderToolComponent name="Spreadsheet Tool" />,
    category: 'Productivity',
  },
  {
    id: 'presentation-builder',
    name: 'Presentation Builder',
    icon: Presentation,
    description: 'Create slideshows with AI assistance.',
    component: () => <PlaceholderToolComponent name="Presentation Builder" />,
    category: 'Productivity',
  },
  {
    id: 'code-editor',
    name: 'Code Editor',
    icon: Code,
    description: 'View and make minor edits to code snippets.',
    component: () => <PlaceholderToolComponent name="Code Editor" />,
    category: 'Development',
  },
  {
    id: 'game-center',
    name: 'Game Center',
    icon: Gamepad2,
    description: 'Access to casual games.',
    component: () => <PlaceholderToolComponent name="Game Center" />,
    category: 'Entertainment',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    description: 'Customize your CogniCanvas experience.',
    component: () => <PlaceholderToolComponent name="Settings" />,
    category: 'System',
  },
];
