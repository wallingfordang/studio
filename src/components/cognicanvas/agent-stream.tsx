
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ActiveToolInstance, AgentMessage } from './types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Brain, User, Sparkles, Loader2, CheckCircle, RotateCcw } from 'lucide-react';
import { aiAssistedDrafting, type AiAssistedDraftingInput } from '@/ai/flows/ai-assisted-drafting';
import { cn } from '@/lib/utils';

interface AgentStreamProps {
  activeTool: ActiveToolInstance;
  currentContent?: string; 
  onContentUpdate: (newContent: string) => void;
}

// Helper to generate more unique IDs
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const AgentStream: React.FC<AgentStreamProps> = ({ activeTool, currentContent, onContentUpdate }) => {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const prevContentRef = useRef<string | undefined>();

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    setMessages([
      { id: generateUniqueId(), type: 'agent', content: `Agent ready for ${activeTool.name}. How can I assist?`, timestamp: new Date() }
    ]);
    setInput('');
    // Reset previous content ref when tool changes to avoid unintended undos
    prevContentRef.current = activeTool.id === 'document-processor' ? currentContent : undefined;
  }, [activeTool, currentContent]); // Added currentContent to dependencies for document-processor

  const addMessage = useCallback((type: AgentMessage['type'], content: string, previewData?: any) => {
    setMessages(prev => [...prev, { id: generateUniqueId(), type, content, timestamp: new Date(), previewData }]);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userInput = input;
    addMessage('user', userInput);
    setInput('');
    setIsLoading(true);
    
    if (activeTool.id === 'document-processor') {
        prevContentRef.current = currentContent; // Store content before AI modification for doc processor
    }

    try {
      addMessage('log', `Processing request for ${activeTool.name}...`);
      
      if (activeTool.id === 'document-processor') {
        addMessage('log', `Engaging Document Processor AI...`);
        const draftInput: AiAssistedDraftingInput = { 
          prompt: currentContent ? `Context:\n${currentContent}\n\nUser request: ${userInput}` : userInput
        };
        const result = await aiAssistedDrafting(draftInput);
        addMessage('log', `AI draft received.`);
        addMessage('agent', result.draft);
        onContentUpdate(result.draft); 
      } else if (activeTool.id === 'web-navigator') {
        // For Web Navigator, the agent might provide guidance or answer general questions.
        // Actual web summarization is handled by the tool's UI.
        // We can enhance this with a specific flow for web navigator agent if needed.
        addMessage('log', `Simulating AI response for ${activeTool.name}...`);
        await new Promise(resolve => setTimeout(resolve, 800));
        addMessage('agent', `For ${activeTool.name}: If you're asking about summarizing a URL, please use the input field in the tool. Otherwise, how can I help you with web navigation tasks or general queries? Your request was: "${userInput}"`);
      } else {
        addMessage('log', `Simulating AI response for ${activeTool.name}...`);
        await new Promise(resolve => setTimeout(resolve, 1200));
        const simulatedResponse = `Understood your request: "${userInput}". For ${activeTool.name}, I've simulated the action. (Actual integration pending).`;
        addMessage('agent', simulatedResponse);
      }

    } catch (error: any) {
      console.error('AI Error:', error);
      addMessage('agent', `Sorry, an error occurred: ${error.message || "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  }, [input, addMessage, activeTool, currentContent, onContentUpdate]);
  
  const handleUndo = useCallback(() => {
    if (activeTool.id === 'document-processor' && prevContentRef.current !== undefined) {
      onContentUpdate(prevContentRef.current);
      addMessage('log', `Reverted to previous content for ${activeTool.name}.`);
      // Optionally clear prevContentRef after undo to prevent multiple undos of the same state
      // prevContentRef.current = undefined; 
    } else {
      addMessage('log', 'Undo action is primarily for Document Processor content or not applicable here.');
    }
  }, [activeTool.id, activeTool.name, onContentUpdate, addMessage]);


  return (
    <div className="flex flex-col h-full bg-inherit text-foreground"> {/* Changed bg-background to bg-inherit */}
      <ScrollArea className="flex-grow p-3 space-y-3" ref={scrollAreaRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={cn('flex mb-2', msg.type === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn('flex items-end gap-2 max-w-[85%]', msg.type === 'log' ? 'w-full' : '')}>
              {msg.type !== 'user' && msg.type !== 'log' && (
                <Avatar className="h-7 w-7 self-start border border-border">
                  <AvatarFallback className="bg-muted">
                    {msg.type === 'agent' && <Brain className="h-3.5 w-3.5 text-primary" />}
                    {msg.type === 'preview' && <Sparkles className="h-3.5 w-3.5 text-accent" />}
                  </AvatarFallback>
                </Avatar>
              )}
               {msg.type === 'user' && (
                <Avatar className="h-7 w-7 self-start border border-border order-2">
                  <AvatarFallback className="bg-accent/20">
                     <User className="h-3.5 w-3.5 text-accent" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn('p-2.5 rounded-xl shadow-sm text-sm leading-relaxed',
                  msg.type === 'user' ? 'bg-accent text-accent-foreground rounded-br-none order-1' : '',
                  msg.type === 'agent' ? 'bg-card text-card-foreground rounded-bl-none border border-border' : '',
                  msg.type === 'log' ? 'text-xs text-muted-foreground italic w-full text-center py-1 px-2 bg-transparent shadow-none' : '',
                  msg.type === 'preview' ? 'border border-border bg-background p-2' : ''
                )}
              >
                {msg.content}
                {msg.type === 'log' && (
                  <span className="text-xs ml-2 text-muted-foreground/60">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-2">
             <div className="flex items-end gap-2 max-w-[85%]">
                <Avatar className="h-7 w-7 self-start border border-border">
                  <AvatarFallback className="bg-muted">
                     <Brain className="h-3.5 w-3.5 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="p-2.5 rounded-xl shadow-sm text-sm bg-card text-card-foreground rounded-bl-none border border-border">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
             </div>
          </div>
        )}
      </ScrollArea>
      
      <div className="border-t border-border p-3 space-y-2.5 bg-inherit"> {/* Changed bg-background to bg-inherit */}
        {activeTool.id === 'document-processor' && messages.some(m => m.type === 'agent') && !isLoading && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => addMessage('log', `Approve action clicked for ${activeTool.name}. (Simulation)`)} className="flex-1 text-xs">
              <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Approve
            </Button>
            <Button variant="outline" size="sm" onClick={handleUndo} className="flex-1 text-xs" disabled={prevContentRef.current === undefined}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Undo
            </Button>
             <Button variant="outline" size="sm" onClick={() => addMessage('log', `Modify action clicked for ${activeTool.name}. (Simulation)`)} className="flex-1 text-xs">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Modify
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${activeTool.name} AI...`}
            rows={1}
            className="flex-grow resize-none min-h-[40px] max-h-[120px] text-sm bg-card focus-visible:ring-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            aria-label="Chat input for AI agent"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon" className="h-10 w-10 shrink-0 rounded-full">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
