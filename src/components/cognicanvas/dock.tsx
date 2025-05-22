
"use client";

import type React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import type { Tool } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, PlugZap } from 'lucide-react';
import { useState, useMemo } from 'react';

interface DockProps {
  tools: Tool[];
  onSelectTool: (tool: Tool) => void;
  activeToolId?: string;
  onAddMcpServerClick: () => void; // New prop for modal trigger
}

export const Dock: React.FC<DockProps> = ({ tools, onSelectTool, activeToolId, onAddMcpServerClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = useMemo(() =>
    tools.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    ), [tools, searchTerm]);

  const toolsByCategory: Record<string, Tool[]> = useMemo(() =>
    filteredTools.reduce((acc, tool) => {
      (acc[tool.category] = acc[tool.category] || []).push(tool);
      return acc;
    }, {} as Record<string, Tool[]>)
  , [filteredTools]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 group-data-[collapsible=icon]:hidden flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full h-9 text-sm justify-start"
          onClick={onAddMcpServerClick} // Use the new prop
        >
          <PlugZap className="mr-2 h-4 w-4" />
          Add MCP Server
        </Button>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            className="pl-8 h-9 text-sm" // Matched height to button
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search tools"
          />
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <SidebarMenu className="p-2 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:px-0.5">
          {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
            <SidebarGroup key={category} className="p-0 mb-3">
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden px-1.5 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{category}</SidebarGroupLabel>
              {categoryTools.map((tool) => (
                <SidebarMenuItem key={tool.id} className="p-0">
                  <SidebarMenuButton
                    onClick={() => onSelectTool(tool)}
                    isActive={tool.id === activeToolId}
                    className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9"
                    tooltip={{ children: tool.name, className: "group-data-[collapsible=icon]:block hidden text-xs"}}
                    variant="ghost"
                    size="default"
                  >
                    <tool.icon className="h-4 w-4 shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden truncate ml-2 text-sm">{tool.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>
          ))}
          {filteredTools.length === 0 && searchTerm && (
            <div className="p-4 text-center text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
              No tools found for "{searchTerm}".
            </div>
          )}
        </SidebarMenu>
      </ScrollArea>
    </div>
  );
};
