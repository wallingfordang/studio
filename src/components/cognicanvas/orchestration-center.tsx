
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Tool } from './types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Send, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import { orchestrateTask, type OrchestrateTaskInput, type ToolInfo } from '@/ai/flows/orchestrate-task-flow';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface OrchestrationCenterProps {
  tools: Tool[];
  onSelectTool: (tool: Tool) => void;
  userName?: string;
}

interface OrchestrationMessage {
  id: string;
  sender: 'user' | 'agent' | 'log';
  text: string;
  timestamp: Date;
  planSteps?: string[];
  identifiedToolIds?: string[];
  isPlan?: boolean;
}

const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const OrchestrationCenter: React.FC<OrchestrationCenterProps> = ({ tools, onSelectTool, userName = "User" }) => {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<OrchestrationMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<{ planSteps: string[], identifiedToolIds: string[] } | null>(null);

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setClientReady(true);
  }, []);
  
  useEffect(() => {
    if (clientReady && conversation.length === 0) {
      setConversation([
        { id: generateUniqueId() + '-initial-agent', sender: 'agent', text: `Hello ${userName}, I'm your Orchestration Agent. How can I help you orchestrate a task or project today?`, timestamp: new Date() }
      ]);
    }
  }, [userName, clientReady]);


  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation, scrollToBottom]);

  const addMessage = useCallback((sender: OrchestrationMessage['sender'], text: string, planDetails?: { planSteps: string[], identifiedToolIds: string[], isPlan: boolean }) => {
    setConversation(prev => [...prev, { id: generateUniqueId(), sender, text, timestamp: new Date(), ...planDetails }]);
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const currentInput = userInput;
    addMessage('user', currentInput);
    setUserInput('');
    setIsProcessing(true);
    setCurrentPlan(null); 

    addMessage('log', 'Orchestration Agent is analyzing your request...');

    try {
      const availableTools: ToolInfo[] = tools.map(t => ({ id: t.id, name: t.name, description: t.description }));
      const orchestrationInput: OrchestrateTaskInput = { userGoal: currentInput, availableTools };
      const result = await orchestrateTask(orchestrationInput);

      if (result.agentThoughtProcess) {
        addMessage('log', `Agent's thought: ${result.agentThoughtProcess}`);
      }

      if (result.clarificationQuestion) {
        addMessage('agent', result.clarificationQuestion);
      } else if (result.planSteps && result.planSteps.length > 0) {
        addMessage('agent', "Here's the plan I've formulated:", { planSteps: result.planSteps, identifiedToolIds: result.identifiedToolIds, isPlan: true });
        setCurrentPlan({ planSteps: result.planSteps, identifiedToolIds: result.identifiedToolIds });
      } else {
        addMessage('agent', "I'm not sure how to proceed with that. Could you please provide more details or clarify your goal?");
      }

    } catch (error: any) {
      console.error('Orchestration Error:', error);
      addMessage('agent', `Sorry, an error occurred while planning: ${error.message || "Please try again."}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecutePlan = () => {
    if (currentPlan && currentPlan.identifiedToolIds.length > 0) {
      const firstToolId = currentPlan.identifiedToolIds[0];
      const toolToOpen = tools.find(t => t.id === firstToolId);
      if (toolToOpen) {
        addMessage('log', `Starting plan by opening ${toolToOpen.name}...`);
        onSelectTool(toolToOpen);
      } else {
        addMessage('agent', `Sorry, I couldn't find the first tool in the plan: ${firstToolId}.`);
      }
    }
    setCurrentPlan(null); 
  };

  const handleRefineTask = () => {
    addMessage('agent', "Okay, please rephrase your task or provide more details for a new plan.");
    setCurrentPlan(null);
    setUserInput(''); 
  };
  
  return (
    <div className="flex flex-col h-full p-4 md:p-6 lg:p-8 bg-background text-foreground overflow-hidden">
      <Card className="shadow-xl border-border flex flex-col flex-grow min-h-0"> {/* Chat Card takes all available space */}
        <CardHeader className="border-b p-4">
          <CardTitle className="text-xl flex items-center">
            <Sparkles className="mr-3 h-6 w-6 text-primary" />
            Orchestration Agent
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-grow flex flex-col overflow-hidden">
          <ScrollArea className="flex-grow" viewportRef={scrollViewportRef}>
            <div className="p-6 space-y-4">
              {conversation.map((msg) => (
                <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} ${msg.sender === 'log' ? 'my-1' : 'my-2'}`}>
                  {msg.sender === 'agent' && (
                    <Avatar className="h-7 w-7 self-start mr-2 border border-border shrink-0">
                      <AvatarFallback className="bg-primary/10">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`p-3 rounded-lg text-sm shadow-sm max-w-[85%] md:max-w-[75%] ${
                    msg.sender === 'user' ? 'bg-primary text-primary-foreground ml-auto rounded-br-none' 
                    : msg.sender === 'agent' ? 'bg-card border border-border rounded-bl-none' 
                    : 'text-xs text-muted-foreground italic w-full text-center py-1.5 px-2 bg-transparent shadow-none'
                  }`}>
                    {msg.text}
                    {msg.isPlan && msg.planSteps && msg.planSteps.length > 0 && (
                      <div className="mt-2.5 pt-2.5 border-t border-border/50">
                        <h4 className="font-semibold mb-1.5 text-sm">Proposed Plan:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {msg.planSteps.map((step, index) => <li key={index}>{step}</li>)}
                        </ul>
                      </div>
                    )}
                    {msg.sender !== 'log' && (
                      <p className={`text-xs mt-1.5 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                     <Avatar className="h-7 w-7 self-start ml-2 border border-border shrink-0">
                        <AvatarFallback className="bg-accent/20">
                           <MessageSquare className="h-4 w-4 text-accent" />
                        </AvatarFallback>
                     </Avatar>
                  )}
                </div>
              ))}
              {isProcessing && (
                 <div className="flex justify-start my-2">
                    <Avatar className="h-7 w-7 self-start mr-2 border border-border shrink-0">
                        <AvatarFallback className="bg-primary/10">
                           <Sparkles className="h-4 w-4 text-primary" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-card border border-border text-sm shadow-sm">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          {currentPlan && !isProcessing && (
            <div className="p-4 border-t bg-card flex gap-2 justify-end">
              <Button variant="outline" onClick={handleRefineTask}>Refine Task</Button>
              <Button onClick={handleExecutePlan}>Execute Plan</Button>
            </div>
          )}
          <div className="p-3 border-t bg-card">
            <div className="flex items-start gap-2">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe the task (e.g., 'Plan a weekend trip to the mountains')"
                rows={1}
                className="flex-grow resize-none min-h-[42px] max-h-[150px] text-sm bg-background focus-visible:ring-primary rounded-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isProcessing}
              />
              <Button onClick={handleSendMessage} disabled={isProcessing || !userInput.trim()} size="icon" className="h-auto p-2.5 aspect-square shrink-0 rounded-lg">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
    
