
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
import { Space } from '@/components/cognicanvas/space';
import type { ActiveToolInstance, Tool } from '@/components/cognicanvas/types';
import { ALL_TOOLS } from '@/components/cognicanvas/constants.tsx';
import { ThemeSwitcher } from '@/components/cognicanvas/theme-switcher';
import { Button } from '@/components/ui/button';
import { HelpCircle, Bot } from 'lucide-react';

// A small component to handle the sidebar trigger within the provider context
const CustomSidebarTrigger = () => {
  // const { toggleSidebar } = useSidebar(); // SidebarTrigger handles its own toggling
  return (
    <Button
      asChild // Use asChild to pass props to SidebarTrigger
      variant="ghost"
      size="icon"
      // onClick={toggleSidebar} // Remove: SidebarTrigger already calls toggleSidebar
      className="h-8 w-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
    >
      <SidebarTrigger />
    </Button>
  );
};


export default function AgentComputerLayout() {
  const [activeToolInstance, setActiveToolInstance] = useState<ActiveToolInstance | null>(null);
  const [documentContent, setDocumentContent] = useState<string>(''); 

  const openTool = useCallback((tool: Tool) => {
    const newInstance: ActiveToolInstance = {
      ...tool,
      instanceId: `${tool.id}-${Date.now()}`,
      windowState: 'default',
      // Preserve content if switching back to document processor and content exists
      content: tool.id === 'document-processor' ? documentContent : undefined,
    };
    setActiveToolInstance(newInstance);
  }, [documentContent]);

  useEffect(() => {
    const defaultTool = ALL_TOOLS.find(t => t.id === 'document-processor');
    if (defaultTool && !activeToolInstance) {
      openTool(defaultTool);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 


  const handleContentChange = useCallback((newContent: string) => {
    // This function is primarily for the Document Processor or tools that manage a central piece of text content
    if (activeToolInstance?.id === 'document-processor') {
      setDocumentContent(newContent);
      // Update content in activeToolInstance if it's the doc processor
      setActiveToolInstance(prev => 
        prev && prev.id === 'document-processor' ? {...prev, content: newContent} : prev
      );
    }
    // For other tools, content changes are managed within the tool or this function could be extended
  }, [activeToolInstance]);

  const handleTutorial = () => {
    alert("Welcome to Agent-Computer!\n\n- Use the Dock on the left to select tools.\n- Each tool has its own integrated AI Agent and Smart Suggestions.\n- Interact with the AI for assistance within the tool.\n\nThis is a brief overview. More detailed tutorials coming soon!");
  };
  
  const [defaultSidebarOpen, setDefaultSidebarOpen] = React.useState(true);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = () => setDefaultSidebarOpen(!mediaQuery.matches);
    handleResize(); 
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);


  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <Sidebar
          side="left"
          variant="sidebar" 
          collapsible="icon"
          className="border-r bg-sidebar text-sidebar-foreground shadow-md data-[collapsible=icon]:shadow-sm transition-all duration-300 ease-in-out z-20"
        >
          <SidebarHeader className="p-2 flex justify-between items-center h-14 border-b border-sidebar-border">
             <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center w-full">
                <Bot className="h-7 w-7 text-primary shrink-0" />
                <h1 className="text-xl font-bold text-primary group-data-[collapsible=icon]:hidden truncate">Agent-Computer</h1>
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

        <SidebarInset className="flex flex-col flex-1 overflow-hidden relative">
          <div className="absolute top-2 left-2 z-10 md:hidden">
             <CustomSidebarTrigger />
          </div>
          <Space activeToolInstance={activeToolInstance} onContentChange={handleContentChange} />
        </SidebarInset>

      </div>
      <Toaster />
    </SidebarProvider>
  );
}
