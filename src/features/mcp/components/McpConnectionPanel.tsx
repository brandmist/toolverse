import React, { useState } from 'react';
import { useMcp } from '../context/McpContext';
import { Plug, Wifi, WifiOff, AlertTriangle } from 'lucide-react';

export const McpConnectionPanel: React.FC = () => {
  const { state, error, connect, disconnect, currentUrl } = useMcp();
  const [url, setUrl] = useState(currentUrl || 'ws://localhost:8080/mcp');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'connected' || state === 'connecting') {
      disconnect();
    } else {
      if (url) connect(url);
    }
  };

  return (
    <div className="glass-panel p-6 w-full max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-lg ${state === 'connected' ? 'bg-surface border border-border text-success' : state === 'error' ? 'bg-surface border border-border text-danger' : 'bg-surface border border-border text-text-primary'}`}>
          {state === 'connected' ? <Wifi className="w-6 h-6" /> : state === 'error' ? <AlertTriangle className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">MCP Connection</h2>
          <p className="text-sm text-text-muted capitalize">Status: {state}</p>
        </div>
      </div>

      <form onSubmit={handleConnect} className="space-y-4">
        <div>
          <label htmlFor="mcp-url" className="block text-sm font-medium text-text-primary mb-2">
            Server WebSocket URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Plug className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="text"
              id="mcp-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={state === 'connected' || state === 'connecting'}
              className="block w-full pl-10 pr-3 py-3 rounded-lg glass text-text-primary placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              placeholder="ws://localhost:8080/mcp"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-surface border border-border border-border text-danger text-sm flex gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-colors
            ${state === 'connected' || state === 'connecting' 
              ? 'bg-card border border-border hover:bg-card-hover' 
              : 'bg-card border border-border hover:bg-card-hover'
            }`}
        >
          {state === 'connecting' ? 'Connecting...' : state === 'connected' ? 'Disconnect' : 'Connect'}
        </button>
      </form>
    </div>
  );
};
