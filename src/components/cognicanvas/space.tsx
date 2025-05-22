"use client";

import type React from 'react';
import type { ActiveToolInstance } from './types';
import Image from 'next/image';
import { Compass } from 'lucide-react';

interface SpaceProps {
  activeToolInstance: ActiveToolInstance | null;
  onContentChange: (content: string) => void;
}

export const Space: React.FC<SpaceProps> = ({ activeToolInstance, onContentChange }) => {
  if (!activeToolInstance) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-background text-muted-foreground p-8 h-full">
        <Compass className="w-24 h-24 text-primary/30 mb-6" strokeWidth={1}/>
        <h2 className="text-3xl font-semibold mb-3 text-foreground tracking-tight">Welcome to CogniCanvas</h2>
        <p className="text-center max-w-lg text-base">
          Your intelligent workspace awaits. Select a tool from the dock on the left to begin your AI-assisted journey.
        </p>
        <div className="mt-8">
          <Image 
            src="https://placehold.co/400x250.png" 
            alt="CogniCanvas Abstract Workspace" 
            width={400} 
            height={250} 
            className="rounded-xl shadow-2xl" 
            priority
            data-ai-hint="abstract workspace"
          />
        </div>
      </div>
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
