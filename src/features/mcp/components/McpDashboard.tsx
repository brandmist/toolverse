import React, { useState } from 'react';
import { McpConnectionPanel } from './McpConnectionPanel';
import { McpToolSelector } from './McpToolSelector';
import { McpToolExecutor } from './McpToolExecutor';
import { useMcp } from '../context/McpContext';
import { Network } from 'lucide-react';

export const McpDashboard: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const { state } = useMcp();

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-4 flex items-center justify-center gap-3">
          <Network className="w-10 h-10 text-text-primary" />
          MCP Client Dashboard
        </h1>
        <p className="text-lg text-text-muted max-w-2xl mx-auto">
          Connect to a Model Context Protocol (MCP) server to discover and execute AI tools and resources directly from your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <McpConnectionPanel />
          
          {state === 'connected' && (
            <div className="bg-surface border border-border border-border rounded-xl p-4">
              <h3 className="text-sm font-medium text-text-primary mb-2">How it works</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                You are connected to the MCP server. Select a tool from the list to view its required parameters and execute it. The server will process your request and return the result.
              </p>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-8 space-y-8">
          {state === 'connected' ? (
            <>
              <McpToolSelector 
                selectedTool={selectedTool} 
                onSelectTool={setSelectedTool} 
              />
              <McpToolExecutor toolName={selectedTool} />
            </>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-border rounded-xl bg-surface border border-border">
              <div className="text-center">
                <Network className="w-12 h-12 text-text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-muted mb-1">Not Connected</h3>
                <p className="text-sm text-text-muted">Connect to an MCP server to view available tools.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
