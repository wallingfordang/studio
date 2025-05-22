
"use client";

import React, { useState, useEffect } from 'react';
import type { Tool } from './types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Send, PlayCircle, ExternalLink, PlugZap } from 'lucide-react'; // Added PlugZap

interface OrchestrationCenterProps {
  tools: Tool[];
  onSelectTool: (tool: Tool) => void;
  userName?: string; // Optional user name for personalization
}

interface OrchestrationMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

export const OrchestrationCenter: React.FC<OrchestrationCenterProps> = ({ tools, onSelectTool, userName = "User" }) => {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<OrchestrationMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Set initial welcome message on client-side after hydration
    setConversation([
      { id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-initial-agent`, sender: 'agent', text: `Hello ${userName}, how can I help you orchestrate your day?`, timestamp: new Date() }
    ]);
  }, [userName]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage: OrchestrationMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-user`,
      sender: 'user',
      text: userInput,
      timestamp: new Date(),
    };
    setConversation(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsProcessing(true);

    // Simulate agent processing and response
    setTimeout(() => {
      let agentResponseText = "I'm processing your request. Let's break this down...";
      if (userInput.toLowerCase().includes("tokyo trip")) {
        agentResponseText = "Okay, for your Tokyo trip, I can help with flights, hotels, calendar, and a packing list. Do you have airline or hotel preferences?";
      } else if (userInput.toLowerCase().includes("hello") || userInput.toLowerCase().includes("hi")) {
        agentResponseText = `Hi ${userName}! What complex task can I help you plan and execute today?`;
      } else {
        agentResponseText = `I've received your request: "${newUserMessage.text.substring(0,50)}...". I'll propose a plan: 1. Analyze. 2. Delegate. 3. Monitor. Proceed?`;
      }

      const newAgentMessage: OrchestrationMessage = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-agent`,
        sender: 'agent',
        text: agentResponseText,
        timestamp: new Date(),
      };
      setConversation(prev => [...prev, newAgentMessage]);
      setIsProcessing(false);
    }, 1500);
  };
  
  const quickAccessTools = tools.filter(tool => tool.category === 'Productivity' || tool.category === 'Creative');

  return (
    <div className="flex flex-col h-full p-4 md:p-6 lg:p-8 bg-background text-foreground overflow-y-auto space-y-6 lg:space-y-8">
      {/* Central Focus: Orchestration Agent Interaction */}
      <Card className="shadow-xl border-border flex flex-col flex-grow lg:flex-grow-0 lg:min-h-[400px]">
        <CardHeader className="border-b">
          <CardTitle className="text-xl flex items-center">
            <Bot className="mr-3 h-6 w-6 text-primary" />
            Orchestration Agent
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-grow flex flex-col">
          <ScrollArea className="flex-grow p-4 space-y-4 min-h-[200px] max-h-[calc(100vh-450px)] sm:max-h-[calc(100vh-400px)] lg:max-h-[calc(100%-100px)]"> {/* Adjusted max-h */}
            {conversation.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[80%] text-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
                  {msg.text}
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isProcessing && (
               <div className="flex justify-start">
                  <div className="p-3 rounded-lg bg-card border text-sm">Thinking...</div>
               </div>
            )}
          </ScrollArea>
          <div className="p-4 border-t bg-card">
            <div className="flex items-center gap-2">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe the task you'd like to accomplish..."
                rows={2}
                className="flex-grow resize-none bg-background focus-visible:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isProcessing}
              />
              <Button onClick={handleSendMessage} disabled={isProcessing || !userInput.trim()} size="icon" className="h-auto p-3 shrink-0">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access */}
      <Card className="shadow-xl border-border">
        <CardHeader className="border-b">
          <CardTitle className="text-xl flex items-center">
            <PlayCircle className="mr-3 h-6 w-6 text-primary" />
            Quick Access
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-md">Launch a Specific Tool</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {quickAccessTools.map(tool => (
                <Button key={tool.id} variant="outline" className="flex-col h-auto p-3 justify-start items-start text-left" onClick={() => onSelectTool(tool)}>
                  <tool.icon className="h-5 w-5 mb-1.5 text-primary" />
                  <span className="text-sm font-medium">{tool.name}</span>
                  <span className="text-xs text-muted-foreground truncate w-full">{tool.description}</span>
                </Button>
              ))}
              <Button variant="outline" className="flex-col h-auto p-3 justify-start items-start text-left" onClick={() => alert('Add MCP Server dialog would appear here.')}>
                  <PlugZap className="h-5 w-5 mb-1.5 text-primary" />
                  <span className="text-sm font-medium">Add MCP Server</span>
                   <span className="text-xs text-muted-foreground">Connect a new server</span>
              </Button>
              <Button variant="outline" className="flex-col h-auto p-3 justify-start items-start text-left" onClick={() => alert('Show all tools modal or navigate to a full tool list.')}>
                  <ExternalLink className="h-5 w-5 mb-1.5 text-muted-foreground" />
                  <span className="text-sm font-medium">View All Tools</span>
                   <span className="text-xs text-muted-foreground">Explore full capabilities</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
