
"use client";

import type React from 'react';
import type { ActiveToolInstance, Tool } from './types';
import { OrchestrationCenter } from './orchestration-center'; // Import the new component

interface SpaceProps {
  activeToolInstance: ActiveToolInstance | null;
  onContentChange: (content: string) => void;
  tools: Tool[]; // Add tools array for OrchestrationCenter
  onSelectTool: (tool: Tool) => void; // Add onSelectTool for OrchestrationCenter
}

export const Space: React.FC<SpaceProps> = ({ activeToolInstance, onContentChange, tools, onSelectTool }) => {
  if (!activeToolInstance) {
    // If no tool is active, show the Orchestration Command Center
    return (
      <main className="flex-grow bg-background overflow-auto h-full">
        <OrchestrationCenter tools={tools} onSelectTool={onSelectTool} />
      </main>
    );
  }

  const ToolComponent = activeToolInstance.component;

  return (
    <main className="flex-grow p-1 md:p-2 lg:p-4 bg-background overflow-auto h-full">
      <div className="h-full w-full rounded-lg"> {/* Added rounded-lg for better aesthetics */}
         <ToolComponent 
            tool={activeToolInstance} 
            content={activeToolInstance.content}
            onContentChange={onContentChange}
        />
      </div>
    </main>
  );
};

    