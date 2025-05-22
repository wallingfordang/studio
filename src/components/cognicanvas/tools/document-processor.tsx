
"use client";

import type { ToolProps } from '@/components/cognicanvas/types';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FileDownloadButton } from '@/components/cognicanvas/file-download-button';
import { AgentStream } from '@/components/cognicanvas/agent-stream';
import { SmartSuggestions } from '@/components/cognicanvas/smart-suggestions';

export const DocumentProcessor: React.FC<ToolProps> = ({ tool, content, onContentChange }) => {
  return (
    <Card className="h-full flex flex-col shadow-xl rounded-lg overflow-hidden border-border bg-card">
      <CardHeader className="bg-card border-b p-4">
        <CardTitle className="text-lg font-semibold flex items-center text-card-foreground">
          <tool.icon className="mr-2 h-5 w-5 text-primary" />
          {tool.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex flex-row overflow-hidden">
        {/* Textarea part */}
        <div className="flex-grow relative h-full">
          <Textarea
            value={content || ''} // Ensure content is not undefined
            onChange={(e) => onContentChange?.(e.target.value)}
            placeholder="Start drafting your document..."
            className="h-full w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-4 text-base absolute inset-0 bg-card text-card-foreground"
            aria-label="Document content editor"
          />
        </div>
        {/* Agent Stream + Smart Suggestions part */}
        <div className="w-[340px] md:w-[380px] lg:w-[420px] border-l border-border flex flex-col bg-sidebar text-sidebar-foreground shrink-0">
          <AgentStream
            activeTool={tool}
            currentContent={content}
            onContentUpdate={(newContent) => onContentChange?.(newContent)}
          />
          <SmartSuggestions activeToolName={tool.name} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-3 flex justify-end bg-card">
        <FileDownloadButton
          content={content || ""}
          filename={`${tool.name.toLowerCase().replace(/\s+/g, '-')}-output.txt`}
          variant="outline"
          size="sm"
        >
          Download Document
        </FileDownloadButton>
      </CardFooter>
    </Card>
  );
};
