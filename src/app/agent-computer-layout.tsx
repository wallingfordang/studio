
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
import { TutorialModal } from '@/components/cognicanvas/tutorial-modal';
import { AddMcpServerModal } from '@/components/cognicanvas/add-mcp-server-modal'; // Added import

// A small component to handle the sidebar trigger within the provider context
const CustomSidebarTrigger = () => {
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="h-8 w-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
    >
      <SidebarTrigger />
    </Button>
  );
};


export default function AgentComputerLayout() {
  const [activeToolInstance, setActiveToolInstance] = useState<ActiveToolInstance | null>(null);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [isAddMcpServerModalOpen, setIsAddMcpServerModalOpen] = useState(false); // Added state for MCP modal

  const openTool = useCallback((tool: Tool) => {
    const newInstance: ActiveToolInstance = {
      ...tool,
      instanceId: `${tool.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      windowState: 'default',
      content: tool.id === 'document-processor' ? documentContent : undefined,
    };
    setActiveToolInstance(newInstance);
  }, [documentContent]);

  const handleContentChange = useCallback((newContent: string) => {
    if (activeToolInstance?.id === 'document-processor') {
      setDocumentContent(newContent);
      setActiveToolInstance(prev =>
        prev && prev.id === 'document-processor' ? {...prev, content: newContent} : prev
      );
    }
  }, [activeToolInstance]);

  const handleTutorial = () => {
    setIsTutorialModalOpen(true);
  };

  const handleOpenAddMcpServerModal = () => {
    setIsAddMcpServerModalOpen(true);
  };

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [hasMounted, setHasMounted] = React.useState(false);

  useEffect(() => {
    setHasMounted(true);
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = () => {
      setIsSidebarOpen(!mediaQuery.matches);
    };
    handleResize();
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const navigateToOrchestrationCenter = () => {
    setActiveToolInstance(null);
  };


  return (
    <SidebarProvider
      open={hasMounted ? isSidebarOpen : true}
      onOpenChange={setIsSidebarOpen}
    >
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <Sidebar
          side="left"
          variant="sidebar"
          collapsible="icon"
          className="border-r bg-sidebar text-sidebar-foreground shadow-md data-[collapsible=icon]:shadow-sm transition-all duration-300 ease-in-out z-20"
        >
          <SidebarHeader className="p-2 flex justify-between items-center h-14 border-b border-sidebar-border">
             <button onClick={navigateToOrchestrationCenter} className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center w-full cursor-pointer hover:opacity-80 transition-opacity">
                <Bot className="h-7 w-7 text-primary shrink-0" />
                <h1 className="text-xl font-bold text-primary group-data-[collapsible=icon]:hidden truncate">Agent-Computer</h1>
             </button>
          </SidebarHeader>
          <SidebarContent className="p-0">
            <Dock 
              tools={ALL_TOOLS} 
              onSelectTool={openTool} 
              activeToolId={activeToolInstance?.id}
              onAddMcpServerClick={handleOpenAddMcpServerModal} // Passed down handler
            />
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
          <Space
            activeToolInstance={activeToolInstance}
            onContentChange={handleContentChange}
            tools={ALL_TOOLS}
            onSelectTool={openTool}
          />
        </SidebarInset>
      </div>
      <Toaster />
      <TutorialModal isOpen={isTutorialModalOpen} onOpenChange={setIsTutorialModalOpen} />
      <AddMcpServerModal isOpen={isAddMcpServerModalOpen} onOpenChange={setIsAddMcpServerModalOpen} />
    </SidebarProvider>
  );
}
