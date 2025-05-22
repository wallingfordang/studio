import type { LucideIcon } from 'lucide-react';
import type React from 'react';

export interface Tool {
  id: string;
  name: string;
  icon: LucideIcon | React.ElementType;
  description: string;
  component: React.ComponentType<ToolProps>;
  category: string;
}

export interface ToolProps {
  tool: Tool;
  content?: string; 
  onContentChange?: (content: string) => void;
}

export interface ActiveToolInstance extends Tool {
  instanceId: string;
  windowState: 'minimized' | 'default' | 'maximized'; // For future window management
  content?: string; // Tool-specific content, e.g., for DocumentProcessor
}

export interface AgentMessage {
  id: string;
  type: 'user' | 'agent' | 'log' | 'preview';
  content: string;
  timestamp: Date;
  previewData?: any; 
}
