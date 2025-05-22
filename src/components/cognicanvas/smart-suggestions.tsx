
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, RefreshCcw, AlertCircle, Loader2 } from 'lucide-react';
import { getSmartSuggestions, type SmartSuggestionsInput } from '@/ai/flows/smart-suggestions';
import { Skeleton } from '@/components/ui/skeleton';

interface SmartSuggestionsProps {
  activeToolName: string;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ activeToolName }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async (toolName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const input: SmartSuggestionsInput = { activeTool: toolName };
      const result = await getSmartSuggestions(input);
      setSuggestions(result.suggestions);
    } catch (e: any) {
      console.error("Error fetching smart suggestions:", e);
      setError(e.message || 'Failed to fetch suggestions.');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeToolName) {
      fetchSuggestions(activeToolName);
    }
  }, [activeToolName, fetchSuggestions]);

  return (
    <div className="p-3 border-t border-border bg-inherit"> {/* Changed bg-background to bg-inherit */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold flex items-center text-foreground">
          <Lightbulb className="mr-1.5 h-4 w-4 text-primary" />
          Smart Suggestions
        </h3>
        <Button variant="ghost" size="icon" onClick={() => fetchSuggestions(activeToolName)} disabled={isLoading} className="h-7 w-7">
          <RefreshCcw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
           <span className="sr-only">Refresh suggestions</span>
        </Button>
      </div>
      <div className="text-xs">
        {isLoading && (
          <div className="space-y-1.5">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-3.5 w-full rounded bg-muted/50" />)}
          </div>
        )}
        {error && (
          <p className="text-destructive flex items-center">
            <AlertCircle className="h-3.5 w-3.5 mr-1.5 shrink-0"/> {error}
          </p>
        )}
        {!isLoading && !error && suggestions.length > 0 && (
          <ul className="space-y-1 text-muted-foreground">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="hover:text-foreground transition-colors cursor-pointer">
                <span className="text-primary mr-1">&bull;</span>{suggestion}
              </li>
            ))}
          </ul>
        )}
        {!isLoading && !error && suggestions.length === 0 && (
          <p className="text-muted-foreground">No suggestions right now. Explore {activeToolName}!</p>
        )}
      </div>
    </div>
  );
};
