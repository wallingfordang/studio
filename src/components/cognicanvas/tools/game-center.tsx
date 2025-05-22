
"use client";

import type { ToolProps } from '@/components/cognicanvas/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AgentStream } from '@/components/cognicanvas/agent-stream';
import { SmartSuggestions } from '@/components/cognicanvas/smart-suggestions';
import { Gamepad2, Puzzle, Spade, ArrowLeft, LayoutGrid } from 'lucide-react';
import React, { useState } from 'react';

interface Game {
  id: 'chess' | 'poker';
  name: string;
  description: string;
  icon: React.ElementType;
}

const games: Game[] = [
  {
    id: 'chess',
    name: 'Chess vs. AI',
    description: 'Challenge an AI opponent in a classic game of strategy. Sharpen your mind and master the board.',
    icon: Puzzle,
  },
  {
    id: 'poker',
    name: 'Poker vs. AI',
    description: 'Test your skills against AI players. Can you bluff your way to victory in this card game classic?',
    icon: Spade,
  },
];

export const GameCenter: React.FC<ToolProps> = ({ tool, content, onContentChange }) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
  };

  const handleBackToSelection = () => {
    setSelectedGame(null);
  };

  const renderGameSelection = () => (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-6">
      <div className="mb-6 text-center">
        <LayoutGrid className="w-12 h-12 mx-auto mb-3 text-primary/70" />
        <h2 className="text-2xl font-semibold text-foreground">Choose Your Game</h2>
        <p className="text-muted-foreground">Select a game below to start playing against an AI opponent.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {games.map((game) => (
          <Card 
            key={game.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer bg-card hover:bg-accent/10 flex flex-col"
            onClick={() => handleGameSelect(game)}
          >
            <CardHeader className="items-center p-4">
              <game.icon className="w-10 h-10 text-primary mb-2" />
              <CardTitle className="text-lg text-center">{game.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
              <p className="text-sm text-muted-foreground text-center">{game.description}</p>
            </CardContent>
            <CardFooter className="p-4 justify-center">
                <Button variant="outline" size="sm" className="w-full">Play {game.name.split(' ')[0]}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSelectedGame = () => {
    if (!selectedGame) return null;
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <Button 
          variant="ghost" 
          onClick={handleBackToSelection} 
          className="absolute top-4 left-4 text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>
        <selectedGame.icon className="w-20 h-20 mb-6 text-primary" />
        <h2 className="text-3xl font-semibold mb-3 text-foreground">{selectedGame.name}</h2>
        <p className="text-muted-foreground mb-4">
          The interface for {selectedGame.name} will be displayed here.
        </p>
        <div className="w-full max-w-md p-8 border border-dashed rounded-lg bg-background shadow-inner">
          <p className="text-sm text-muted-foreground">
            Imagine a fully interactive {selectedGame.name.toLowerCase().split(' ')[0]} board here, with all the controls and AI feedback.
            For now, you can interact with the AI agent on the right panel for tips or general queries about the game.
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
            {tool.name} {selectedGame ? `- ${selectedGame.name}` : ''}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex flex-row overflow-hidden">
        {/* Main Game Center content area */}
        <div className="flex-grow flex flex-col bg-background text-card-foreground relative overflow-y-auto">
          {selectedGame ? renderSelectedGame() : renderGameSelection()}
        </div>
        {/* Agent Stream + Smart Suggestions part */}
        <div className="w-[340px] md:w-[380px] lg:w-[420px] border-l border-border flex flex-col bg-sidebar text-sidebar-foreground shrink-0">
          <AgentStream
            activeTool={tool}
            currentContent={selectedGame ? `Playing ${selectedGame.name}` : "Game Center"}
            onContentUpdate={(newContent) => {
              if (onContentChange) onContentChange(newContent);
            }}
          />
          <SmartSuggestions activeToolName={selectedGame ? selectedGame.name : tool.name} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-3 text-xs text-muted-foreground bg-card">
        {selectedGame ? `Enjoy your game of ${selectedGame.name}!` : `${tool.name} - Powered by Agent-Computer.`}
      </CardFooter>
    </Card>
  );
};
