"use client";

import type { ToolProps } from '@/components/cognicanvas/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { summarizeWebpage } from '@/ai/flows/web-navigator-summarization';
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Globe, Search, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { AgentStream } from '@/components/cognicanvas/agent-stream';
import { SmartSuggestions } from '@/components/cognicanvas/smart-suggestions';

export const WebNavigator: React.FC<ToolProps> = ({ tool, onContentChange }) => {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDisplayUrl, setCurrentDisplayUrl] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!url) {
      setError('Please enter a URL.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSummary('');
    setCurrentDisplayUrl(null);
    try {
      new URL(url); 
      const result = await summarizeWebpage({ url });
      setSummary(result.summary);
      setCurrentDisplayUrl(url);
      // Note: WebNavigator doesn't use the global onContentChange for its primary content (summary)
      // but AgentStream might, so we pass a handler.
    } catch (e: any) {
      console.error("Error summarizing webpage:", e);
      if (e instanceof TypeError && e.message.includes("Invalid URL")) {
        setError("Invalid URL. Please ensure it starts with http:// or https://");
      } else {
        setError(e.message || 'Failed to summarize webpage. The AI model might be unavailable or the URL inaccessible.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-xl rounded-lg overflow-hidden border-border bg-card">
      <CardHeader className="bg-card border-b p-4">
        <CardTitle className="text-lg font-semibold flex items-center text-card-foreground">
          <tool.icon className="mr-2 h-5 w-5 text-primary" />
          {tool.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex flex-row overflow-hidden">
        {/* Main WebNavigator content area */}
        <div className="flex-grow flex flex-col gap-4 p-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-grow">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL (e.g., https://example.com)"
                className="pl-10 bg-card focus:bg-background" // Ensure input field is visible
                disabled={isLoading}
                aria-label="URL input"
              />
            </div>
            <Button onClick={handleSummarize} disabled={isLoading} className="shrink-0">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              {isLoading ? 'Summarizing...' : 'Summarize'}
            </Button>
          </div>
          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/50 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {summary && currentDisplayUrl && (
            <>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-base text-foreground">Summary:</h3>
                <Button variant="ghost" size="sm" asChild>
                  <a href={currentDisplayUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Open Original <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
              <ScrollArea className="flex-grow min-h-[200px] border rounded-md p-3 bg-background shadow-inner">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{summary}</p>
              </ScrollArea>
            </>
          )}
          {!summary && !isLoading && !error && (
            <div className="flex-grow flex flex-col items-center justify-center text-center text-muted-foreground p-4 border border-dashed rounded-md">
              <Globe className="h-12 w-12 mb-3 text-primary/50" />
              <p>Enter a URL above and click "Summarize" to get an AI-powered summary of the webpage content.</p>
            </div>
          )}
          {isLoading && !summary && ( // Show loader only if summary isn't loaded yet
            <div className="flex-grow flex items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <p>Loading summary, please wait...</p>
            </div>
          )}
        </div>
        {/* Agent Stream + Smart Suggestions part */}
        <div className="w-[340px] md:w-[380px] lg:w-[420px] border-l border-border flex flex-col bg-sidebar text-sidebar-foreground shrink-0">
          <AgentStream
            activeTool={tool}
            currentContent={summary || url} // Provide summary or URL as context
            onContentUpdate={(newContent) => {
              // The agent in WebNavigator typically doesn't update primary content this way.
              // If it were to, for example, refine a summary, then setSummary(newContent) would go here.
              // For now, this can be a no-op or log.
              if (onContentChange) onContentChange(newContent); // For generic cases if layout expects it
            }}
          />
          <SmartSuggestions activeToolName={tool.name} />
        </div>
      </CardContent>
       <CardFooter className="border-t p-3 text-xs text-muted-foreground bg-card">
        AI-powered summarization by Agent-Computer. Results may vary.
      </CardFooter>
    </Card>
  );
};