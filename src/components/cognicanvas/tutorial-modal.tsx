
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, Bot, Zap, PlayCircle, SlidersHorizontal } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-semibold">
            <HelpCircle className="mr-3 h-6 w-6 text-primary" />
            Welcome to Agent-Computer!
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            Here’s a quick guide to get you started with your new AI-powered workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 text-sm">
          <div className="flex items-start gap-4 p-3 rounded-md border bg-card/50">
            <Bot className="h-7 w-7 text-primary shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-base mb-1">The Agent-Computer Concept</h4>
              <p className="text-muted-foreground leading-relaxed">
                Agent-Computer is a revolutionary environment where AI agents assist you directly within various specialized tools, enhancing your productivity and creativity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 rounded-md border bg-card/50">
            <Zap className="h-7 w-7 text-primary shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-base mb-1">Using Tools & Integrated Agents</h4>
              <p className="text-muted-foreground leading-relaxed">
                Select tools from the <strong className="text-foreground">Dock</strong> on the left. Each tool features its own <strong className="text-foreground">Agent Stream</strong> (typically on the right side of the tool window). Here, you can chat with the tool's dedicated AI assistant, receive real-time updates, and get smart suggestions tailored to your current task.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 rounded-md border bg-card/50">
            <PlayCircle className="h-7 w-7 text-primary shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-base mb-1">Orchestration Center (Main Page)</h4>
              <p className="text-muted-foreground leading-relaxed">
                When no tool is active (or by clicking the Agent-Computer logo), you are in the <strong className="text-foreground">Orchestration Center</strong>. This is your command hub to describe complex, multi-step tasks to the main Orchestration Agent. It can plan and delegate work across multiple tools, streamlining complex workflows.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 rounded-md border bg-card/50">
            <SlidersHorizontal className="h-7 w-7 text-primary shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-base mb-1">Customization & Help</h4>
              <p className="text-muted-foreground leading-relaxed">
                Use the <strong className="text-foreground">Theme Switcher</strong> (palette icon in the sidebar footer) to toggle between light and dark modes. This tutorial can be accessed again at any time via the <strong className="text-foreground">Help</strong> (question mark icon) button in the sidebar footer.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" size="lg">Got it!</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
