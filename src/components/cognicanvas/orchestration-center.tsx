
"use client";

import React, { useState } from 'react';
import type { Tool } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Send, PlayCircle, History, CheckCircle, ListChecks, ExternalLink } from 'lucide-react';

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
  const [conversation, setConversation] = useState<OrchestrationMessage[]>([
    { id: '1', sender: 'agent', text: `Hello ${userName}, how can I help you orchestrate your day?`, timestamp: new Date() }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage: OrchestrationMessage = {
      id: Date.now().toString() + '-user',
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
        id: Date.now().toString() + '-agent',
        sender: 'agent',
        text: agentResponseText,
        timestamp: new Date(),
      };
      setConversation(prev => [...prev, newAgentMessage]);
      setIsProcessing(false);
    }, 1500);
  };
  
  const quickAccessTools = tools.filter(tool => tool.category === 'Productivity' || tool.category === 'Creative').slice(0, 4);

  // Placeholder data
  const activeOrchestrations = [
    { id: 'orch1', name: 'Tokyo Trip Plan', progress: 'Step 2 of 4: Searching Hotels', status: 'active' },
    { id: 'orch2', name: 'Quarterly Report Generation', progress: 'Step 1 of 3: Compiling Data', status: 'active' },
  ];
  const recentAchievements = [
    { id: 'ach1', name: 'Drafted initial marketing proposal', tool: 'Document Processor', date: 'Yesterday' },
    { id: 'ach2', name: 'Summarized Q3 earnings call', tool: 'Web Navigator', date: '2 days ago' },
  ];


  return (
    <div className="flex flex-col h-full p-4 md:p-6 lg:p-8 bg-background text-foreground overflow-y-auto">
      {/* Top Row: Agent Interaction + Active Orchestrations */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6 lg:mb-8 flex-shrink-0">
        {/* Central Focus: Orchestration Agent Interaction */}
        <Card className="lg:w-2/3 shadow-xl border-border flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="text-xl flex items-center">
              <Bot className="mr-3 h-6 w-6 text-primary" />
              Orchestration Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-grow flex flex-col">
            <ScrollArea className="flex-grow p-4 space-y-4 max-h-[calc(100vh-400px)] lg:max-h-[300px]">
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

        {/* Active Orchestrations */}
        <Card className="lg:w-1/3 shadow-xl border-border">
          <CardHeader className="border-b">
            <CardTitle className="text-xl flex items-center">
              <ListChecks className="mr-3 h-6 w-6 text-primary" />
              Active Orchestrations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {activeOrchestrations.length > 0 ? activeOrchestrations.map(orch => (
              <div key={orch.id} className="p-3 border rounded-md bg-card hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-sm">{orch.name}</h4>
                <p className="text-xs text-muted-foreground">{orch.progress}</p>
                <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="xs" className="text-xs" onClick={() => alert(`More details for ${orch.name}`)}>Details</Button>
                    <Button variant="ghost" size="xs" className="text-xs text-destructive hover:bg-destructive/10" onClick={() => alert(`Cancel ${orch.name}`)}>Cancel</Button>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No active orchestrations.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Quick Access + Recent Achievements */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Quick Access */}
        <Card className="lg:w-2/3 shadow-xl border-border">
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
                 <Button variant="outline" className="flex-col h-auto p-3 justify-start items-start text-left" onClick={() => alert('Show all tools modal or navigate to a full tool list.')}>
                    <ExternalLink className="h-5 w-5 mb-1.5 text-muted-foreground" />
                    <span className="text-sm font-medium">View All Tools</span>
                     <span className="text-xs text-muted-foreground">Explore full capabilities</span>
                  </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-md">Session Management</h4>
              <Button variant="outline" onClick={() => alert('Restoring last session...')}>
                <History className="mr-2 h-4 w-4" /> Restore Last Session
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="lg:w-1/3 shadow-xl border-border">
          <CardHeader className="border-b">
            <CardTitle className="text-xl flex items-center">
              <CheckCircle className="mr-3 h-6 w-6 text-primary" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {recentAchievements.length > 0 ? recentAchievements.map(ach => (
              <div key={ach.id} className="p-3 border rounded-md bg-card">
                <h4 className="font-semibold text-sm">{ach.name}</h4>
                <p className="text-xs text-muted-foreground">Via {ach.tool} - {ach.date}</p>
              </div>
            )) : (
               <p className="text-sm text-muted-foreground">No recent achievements to show yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

    