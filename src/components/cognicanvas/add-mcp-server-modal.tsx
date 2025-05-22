
"use client";

import React, { useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Server, Search, PlugZap, Wifi, WifiOff, HelpCircle, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface McpServerInfo {
  id: string;
  name: string;
  description: string;
  status: 'Online' | 'Offline' | 'Experimental';
  type: 'Official' | 'Community' | 'Private';
  region: string;
}

const MOCK_MCP_SERVERS: McpServerInfo[] = [
  { id: 'mcp-us-west-1', name: 'Nexus Prime (US West)', description: 'General purpose MCP server with balanced capabilities.', status: 'Online', type: 'Official', region: 'US West' },
  { id: 'mcp-eu-central-1', name: 'Orion-EU (EU Central)', description: 'High-performance server for compute-intensive tasks.', status: 'Online', type: 'Official', region: 'EU Central' },
  { id: 'mcp-asia-east-1', name: 'Cygnus-AI (Asia East)', description: 'Specialized in advanced AI model hosting.', status: 'Offline', type: 'Official', region: 'Asia East' },
  { id: 'community-forge', name: 'Community Forge', description: 'Open-source community-run MCP server.', status: 'Online', type: 'Community', region: 'Global' },
  { id: 'dev-sandbox-local', name: 'Dev Sandbox (Local)', description: 'Your personal development and testing server.', status: 'Experimental', type: 'Private', region: 'Localhost' },
  { id: 'quantum-leap-beta', name: 'Quantum Leap (Beta)', description: 'Experimental server with next-gen quantum AI features.', status: 'Experimental', type: 'Official', region: 'Undisclosed' },
];

interface AddMcpServerModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const AddMcpServerModal: React.FC<AddMcpServerModalProps> = ({ isOpen, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServers = useMemo(() => {
    if (!searchTerm.trim()) {
      return MOCK_MCP_SERVERS;
    }
    return MOCK_MCP_SERVERS.filter(server =>
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getStatusIcon = (status: McpServerInfo['status']) => {
    switch (status) {
      case 'Online':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'Offline':
        return <WifiOff className="h-4 w-4 text-destructive" />;
      case 'Experimental':
        return <HelpCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: McpServerInfo['type']) => {
    switch (type) {
        case 'Official':
            return <Briefcase className="h-4 w-4 text-blue-500" />;
        case 'Community':
            return <Server className="h-4 w-4 text-purple-500" />; // Changed Users to Server
        case 'Private':
            return <Server className="h-4 w-4 text-gray-500" />;
        default:
            return <Server className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center text-xl font-semibold">
            <PlugZap className="mr-3 h-6 w-6 text-primary" />
            Add MCP Server
          </DialogTitle>
          <DialogDescription className="pt-1">
            Search and connect to available Multi-Context Processing (MCP) servers to expand Agent-Computer's capabilities.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search servers by name, description, type, or region..."
              className="pl-10 h-10 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-grow min-h-0 px-6 py-4">
          {filteredServers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServers.map((server) => (
                <Card key={server.id} className="shadow-md hover:shadow-lg transition-shadow bg-card flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(server.type)}
                        <CardTitle className="text-base font-semibold">{server.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getStatusIcon(server.status)}
                        <span>{server.status}</span>
                      </div>
                    </div>
                    <CardDescription className="text-xs pt-1">{server.region}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground flex-grow pb-4">
                    {server.description}
                  </CardContent>
                  <CardFooter className="pt-0 pb-4">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => alert(`Connect to ${server.name} would be initiated.`)}
                      disabled={server.status === 'Offline'}
                    >
                      Connect
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <Server className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>No MCP servers found matching your search.</p>
              <p className="text-xs">Try a different search term or check back later.</p>
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="p-6 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

