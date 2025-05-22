"use client";
import React, { useState, useCallback, useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Dock } from '@/components/cognicanvas/dock';
import { AgentStream } from '@/components/cognicanvas/agent-stream';
import { Space } from '@/components/cognicanvas/space';
import type { ActiveToolInstance, Tool } from '@/components/cognicanvas/types';
import { ALL_TOOLS } from '@/components/cognicanvas/constants';
import { ThemeSwitcher } from '@/components/cognicanvas/theme-switcher';
import { SmartSuggestions } from '@/components/cognicanvas/smart-suggestions';
import { Button } from '@/components/ui/button';
import { HelpCircle, Bot } from 'lucide-react'; // Added Bot icon for branding

// A small component to handle the sidebar trigger within the provider context
const CustomSidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
      <SidebarTrigger /> {/* This uses PanelLeft internally */}
    </Button>
  );
};


export default function CogniCanvasLayout() {
  const [activeToolInstance, setActiveToolInstance] = useState<ActiveToolInstance | null>(null);
  const [documentContent, setDocumentContent] = useState<string>(''); 

  const openTool = useCallback((tool: Tool) => {
    const newInstance: ActiveToolInstance = {
      ...tool,
      instanceId: `${tool.id}-${Date.now()}`,
      windowState: 'default',
      content: tool.id === 'document-processor' ? documentContent : undefined,
    };
    setActiveToolInstance(newInstance);
  }, [documentContent]);

  useEffect(() => {
    const defaultTool = ALL_TOOLS.find(t => t.id === 'document-processor');
    if (defaultTool && !activeToolInstance) { // Ensure it only runs if no tool is active
      openTool(defaultTool);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 


  const handleContentChange = useCallback((newContent: string) => {
    if (activeToolInstance?.id === 'document-processor') {
      setDocumentContent(newContent);
      // Update content in activeToolInstance if it's the doc processor
      setActiveToolInstance(prev => 
        prev && prev.id === 'document-processor' ? {...prev, content: newContent} : prev
      );
    }
  }, [activeToolInstance]);

  const handleTutorial = () => {
    alert("Welcome to CogniCanvas!\n\n- Use the Dock on the left to select tools.\n- Interact with the AI Agent on the right.\n- Smart Suggestions will appear below the Agent.\n\nThis is a brief overview. More detailed tutorials coming soon!");
  };
  
  // Define defaultOpen state for SidebarProvider based on screen size for better UX
  const [defaultSidebarOpen, setDefaultSidebarOpen] = React.useState(true);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = () => setDefaultSidebarOpen(!mediaQuery.matches);
    handleResize(); // Initial check
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);


  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}> {/* Dock sidebar potentially collapsed on mobile */}
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <Sidebar
          side="left"
          variant="sidebar" // Standard sidebar style
          collapsible="icon"
          className="border-r bg-sidebar text-sidebar-foreground shadow-md data-[collapsible=icon]:shadow-sm transition-all duration-300 ease-in-out z-20"
        >
          <SidebarHeader className="p-2 flex justify-between items-center h-14 border-b border-sidebar-border">
             <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center w-full">
                <Bot className="h-7 w-7 text-primary shrink-0" />
                <h1 className="text-xl font-bold text-primary group-data-[collapsible=icon]:hidden truncate">CogniCanvas</h1>
             </div>
          </SidebarHeader>
          <SidebarContent className="p-0">
            <Dock tools={ALL_TOOLS} onSelectTool={openTool} activeToolId={activeToolInstance?.id} />
          </SidebarContent>
          <SidebarFooter className="p-2 border-t border-sidebar-border h-14">
              <div className="flex items-center justify-center group-data-[collapsible=icon]:flex-col gap-1.5">
                  <ThemeSwitcher />
                  <Button variant="ghost" size="icon" onClick={handleTutorial} className="w-8 h-8" title="Tutorial">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Tutorial</span>
                  </Button>
              </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 overflow-hidden relative"> {/* Ensure SidebarInset takes up remaining space */}
          <div className="absolute top-2 left-2 z-10 md:hidden"> {/* Mobile toggle for Dock */}
             <CustomSidebarTrigger />
          </div>
          <Space activeToolInstance={activeToolInstance} onContentChange={handleContentChange} />
        </SidebarInset>

        {/* Agent Stream Sidebar */}
        {/* For Agent Stream, we might want it to be "floating" or "inset" depending on design.
            Using standard sidebar for now, collapsible from the right. */}
        <Sidebar
          side="right"
          variant="sidebar"
          collapsible="offcanvas" // Makes it retractable completely
          className="border-l bg-sidebar text-sidebar-foreground shadow-md w-[380px] lg:w-[420px] data-[collapsible=icon]:w-14 transition-all duration-300 ease-in-out z-20"
        >
           <SidebarHeader className="p-3 border-b border-sidebar-border h-14 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary group-data-[collapsible=icon]:hidden">AI Companion</h2>
              {/* Optional: Add a trigger here if collapsible="icon" and want manual toggle */}
           </SidebarHeader>
          <SidebarContent className="p-0 flex flex-col overflow-hidden"> {/* Ensure content can scroll if it overflows */}
            {activeToolInstance ? (
              <>
                <AgentStream
                  activeTool={activeToolInstance}
                  currentContent={activeToolInstance.id === 'document-processor' ? documentContent : undefined}
                  onContentUpdate={handleContentChange}
                />
                <SmartSuggestions activeToolName={activeToolInstance.name} />
              </>
            ) : (
              <div className="p-6 text-center text-muted-foreground group-data-[collapsible=icon]:hidden flex flex-col items-center justify-center h-full">
                <Bot className="h-12 w-12 mb-4 text-primary/50" />
                <p>Select a tool to activate AI assistance and smart suggestions.</p>
              </div>
            )}
          </SidebarContent>
        </Sidebar>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
