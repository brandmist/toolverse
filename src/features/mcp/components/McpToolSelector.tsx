import React from 'react';
import { useMcp } from '../context/McpContext';
import { Settings, Box, Play } from 'lucide-react';

interface McpToolSelectorProps {
  onSelectTool: (toolName: string) => void;
  selectedTool: string | null;
}

export const McpToolSelector: React.FC<McpToolSelectorProps> = ({ onSelectTool, selectedTool }) => {
  const { tools, resources, state } = useMcp();

  if (state !== 'connected') {
    return null;
  }

  return (
    <div className="glass-panel p-6 w-full">
      <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-text-primary" />
        Available MCP Tools
      </h3>

      {tools.length === 0 ? (
        <p className="text-text-muted text-sm">No tools available on this server.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {tools.map(tool => (
            <button
              key={tool.name}
              onClick={() => onSelectTool(tool.name)}
              className={`text-left p-4 rounded-lg border transition-all ${
                selectedTool === tool.name 
                  ? 'bg-surface border-indigo-500 ring-1 ring-indigo-500' 
                  : 'bg-surface hover:border-text-primary'
              }`}
            >
              <h4 className="font-medium text-text-primary mb-1 flex items-center justify-between">
                {tool.name}
                {selectedTool === tool.name && <Play className="w-4 h-4 text-text-primary" />}
              </h4>
              <p className="text-xs text-text-muted line-clamp-2">{tool.description || 'No description available'}</p>
            </button>
          ))}
        </div>
      )}

      {resources.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2 mb-4 mt-8">
            <Box className="w-5 h-5 text-text-primary" />
            Available MCP Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map(res => (
              <div key={res.uri} className="p-4 rounded-lg bg-surface border border-border border-border">
                <h4 className="font-medium text-text-primary mb-1">{res.name}</h4>
                <p className="text-xs text-text-muted break-all">{res.uri}</p>
                {res.description && <p className="text-xs text-text-muted mt-2">{res.description}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
