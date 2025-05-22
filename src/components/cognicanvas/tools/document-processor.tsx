"use client";

import type { ToolProps } from '@/components/cognicanvas/types';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FileDownloadButton } from '@/components/cognicanvas/file-download-button';

export const DocumentProcessor: React.FC<ToolProps> = ({ tool, content, onContentChange }) => {
  return (
    <Card className="h-full flex flex-col shadow-xl rounded-lg overflow-hidden border-border bg-card">
      <CardHeader className="bg-card border-b p-4">
        <CardTitle className="text-lg font-semibold flex items-center text-card-foreground">
          <tool.icon className="mr-2 h-5 w-5 text-primary" />
          {tool.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow relative">
        <Textarea
          value={content}
          onChange={(e) => onContentChange?.(e.target.value)}
          placeholder="Start drafting your document..."
          className="h-full w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-4 text-base absolute inset-0"
          aria-label="Document content editor"
        />
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
