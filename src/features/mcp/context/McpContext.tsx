import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { McpClient, McpTool, McpResource, McpConnectionState } from '../api/client';

interface McpContextType {
  state: McpConnectionState;
  error: string | null;
  tools: McpTool[];
  resources: McpResource[];
  connect: (url: string) => void;
  disconnect: () => void;
  callTool: (name: string, args: Record<string, any>) => Promise<any>;
  readResource: (uri: string) => Promise<any>;
  currentUrl: string;
}

const McpContext = createContext<McpContextType | undefined>(undefined);

export const McpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<McpConnectionState>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [tools, setTools] = useState<McpTool[]>([]);
  const [resources, setResources] = useState<McpResource[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  
  const clientRef = useRef<McpClient | null>(null);

  const connect = useCallback((url: string) => {
    if (clientRef.current) {
      clientRef.current.disconnect();
    }

    setCurrentUrl(url);
    setError(null);
    setTools([]);
    setResources([]);

    const client = new McpClient({
      url,
      onStateChange: (newState, newError) => {
        setState(newState);
        if (newError) setError(newError);
      },
      onToolsUpdate: (newTools) => setTools(newTools),
      onResourcesUpdate: (newResources) => setResources(newResources)
    });

    clientRef.current = client;
    client.connect();
  }, []);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    setState('disconnected');
    setCurrentUrl('');
    setTools([]);
    setResources([]);
  }, []);

  const callTool = useCallback(async (name: string, args: Record<string, any>) => {
    if (!clientRef.current) throw new Error("MCP Client not connected");
    return clientRef.current.callTool(name, args);
  }, []);

  const readResource = useCallback(async (uri: string) => {
    if (!clientRef.current) throw new Error("MCP Client not connected");
    return clientRef.current.readResource(uri);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  return (
    <McpContext.Provider
      value={{
        state,
        error,
        tools,
        resources,
        connect,
        disconnect,
        callTool,
        readResource,
        currentUrl
      }}
    >
      {children}
    </McpContext.Provider>
  );
};

export const useMcp = () => {
  const context = useContext(McpContext);
  if (context === undefined) {
    throw new Error('useMcp must be used within an McpProvider');
  }
  return context;
};
