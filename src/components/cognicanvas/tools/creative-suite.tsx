
"use client";

import type { ToolProps } from '@/components/cognicanvas/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AgentStream } from '@/components/cognicanvas/agent-stream';
import { SmartSuggestions } from '@/components/cognicanvas/smart-suggestions';
import { ImageIcon, Music, Film, ArrowLeft, Palette } from 'lucide-react'; // Added Palette for main icon
import React, { useState } from 'react';

interface CreativeFeature {
  id: 'image' | 'music' | 'video';
  name: string;
  description: string;
  icon: React.ElementType;
}

const creativeFeatures: CreativeFeature[] = [
  {
    id: 'image',
    name: 'Image Creation',
    description: 'Generate and edit stunning visuals with AI assistance. Bring your ideas to life.',
    icon: ImageIcon,
  },
  {
    id: 'music',
    name: 'Music Creation',
    description: 'Compose unique soundtracks and melodies. Explore AI-driven musical possibilities.',
    icon: Music,
  },
  {
    id: 'video',
    name: 'Video Creation',
    description: 'Produce compelling video content. From storyboarding to simple edits, powered by AI.',
    icon: Film,
  },
];

export const CreativeSuite: React.FC<ToolProps> = ({ tool, content, onContentChange }) => {
  const [selectedFeature, setSelectedFeature] = useState<CreativeFeature | null>(null);

  const handleFeatureSelect = (feature: CreativeFeature) => {
    setSelectedFeature(feature);
  };

  const handleBackToSelection = () => {
    setSelectedFeature(null);
  };

  const renderFeatureSelection = () => (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-6">
      <div className="mb-6 text-center">
        <Palette className="w-12 h-12 mx-auto mb-3 text-primary/70" />
        <h2 className="text-2xl font-semibold text-foreground">Creative Tools</h2>
        <p className="text-muted-foreground">Select a creative tool below to begin your project.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {creativeFeatures.map((feature) => (
          <Card 
            key={feature.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer bg-card hover:bg-accent/10 flex flex-col"
            onClick={() => handleFeatureSelect(feature)}
          >
            <CardHeader className="items-center p-4">
              <feature.icon className="w-10 h-10 text-primary mb-2" />
              <CardTitle className="text-lg text-center">{feature.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
              <p className="text-sm text-muted-foreground text-center">{feature.description}</p>
            </CardContent>
            <CardFooter className="p-4 justify-center">
                <Button variant="outline" size="sm" className="w-full">Open {feature.name.split(' ')[0]} Tool</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSelectedFeature = () => {
    if (!selectedFeature) return null;
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <Button 
          variant="ghost" 
          onClick={handleBackToSelection} 
          className="absolute top-4 left-4 text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Creative Tools
        </Button>
        <selectedFeature.icon className="w-20 h-20 mb-6 text-primary" />
        <h2 className="text-3xl font-semibold mb-3 text-foreground">{selectedFeature.name}</h2>
        <p className="text-muted-foreground mb-4">
          The interface for {selectedFeature.name} will be displayed here.
        </p>
        <div className="w-full max-w-md p-8 border border-dashed rounded-lg bg-background shadow-inner">
          <p className="text-sm text-muted-foreground">
            This is where the dedicated UI for AI-powered {selectedFeature.name.toLowerCase()} would be.
            Interact with the AI agent on the right for assistance.
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col shadow-xl rounded-lg overflow-hidden border-border bg-card">
      <CardHeader className="bg-card border-b p-4 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <tool.icon className="mr-2 h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold text-card-foreground">
            {tool.name} {selectedFeature ? `- ${selectedFeature.name}` : ''}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex flex-row overflow-hidden">
        {/* Main Creative Suite content area */}
        <div className="flex-grow flex flex-col bg-background text-card-foreground relative overflow-y-auto">
          {selectedFeature ? renderSelectedFeature() : renderFeatureSelection()}
        </div>
        {/* Agent Stream + Smart Suggestions part */}
        <div className="w-[340px] md:w-[380px] lg:w-[420px] border-l border-border flex flex-col bg-sidebar text-sidebar-foreground shrink-0">
          <AgentStream
            activeTool={tool}
            currentContent={selectedFeature ? `Using ${selectedFeature.name}` : tool.name}
            onContentUpdate={(newContent) => {
              if (onContentChange) onContentChange(newContent);
            }}
          />
          <SmartSuggestions activeToolName={selectedFeature ? selectedFeature.name : tool.name} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-3 text-xs text-muted-foreground bg-card">
        {selectedFeature ? `Create something amazing with ${selectedFeature.name}!` : `${tool.name} - Powered by Agent-Computer.`}
      </CardFooter>
    </Card>
  );
};
