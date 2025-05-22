
"use client";

import type { ToolProps } from '@/components/cognicanvas/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AgentStream } from '@/components/cognicanvas/agent-stream';
import { SmartSuggestions } from '@/components/cognicanvas/smart-suggestions';
import { Presentation } from 'lucide-react';

export const PresentationBuilder: React.FC<ToolProps> = ({ tool, content, onContentChange }) => {
  return (
    <Card className="h-full flex flex-col shadow-xl rounded-lg overflow-hidden border-border bg-card">
      <CardHeader className="bg-card border-b p-4">
        <CardTitle className="text-lg font-semibold flex items-center text-card-foreground">
          <tool.icon className="mr-2 h-5 w-5 text-primary" />
          {tool.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex flex-row overflow-hidden">
        {/* Main Tool content area */}
        <div className="flex-grow flex flex-col items-center justify-center p-4 bg-card text-muted-foreground">
          <Presentation className="w-16 h-16 mb-4 text-primary/30" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">{tool.name} UI</h2>
          <p className="text-center">The main interface for {tool.name} will be implemented here.</p>
          <p className="text-xs mt-2">(e.g., slide editor, themes, speaker notes)</p>
        </div>
        {/* Agent Stream + Smart Suggestions part */}
        <div className="w-[340px] md:w-[380px] lg:w-[420px] border-l border-border flex flex-col bg-sidebar text-sidebar-foreground shrink-0">
          <AgentStream
            activeTool={tool}
            currentContent={content || ''}
            onContentUpdate={(newContent) => {
              if (onContentChange) onContentChange(newContent);
            }}
          />
          <SmartSuggestions activeToolName={tool.name} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-3 text-xs text-muted-foreground bg-card">
        {tool.name} - Powered by Agent-Computer.
      </CardFooter>
    </Card>
  );
};
