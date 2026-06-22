export type McpTool = {
  name: string;
  description?: string;
  inputSchema?: any;
};

export type McpResource = {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
};

export type McpConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface McpClientOptions {
  url: string;
  onStateChange?: (state: McpConnectionState, error?: string) => void;
  onToolsUpdate?: (tools: McpTool[]) => void;
  onResourcesUpdate?: (resources: McpResource[]) => void;
}

export class McpClient {
  private url: string;
  private ws: WebSocket | null = null;
  private messageId = 1;
  private pendingRequests: Map<number, { resolve: (val: any) => void; reject: (err: any) => void }> = new Map();
  
  private onStateChange?: (state: McpConnectionState, error?: string) => void;
  private onToolsUpdate?: (tools: McpTool[]) => void;
  private onResourcesUpdate?: (resources: McpResource[]) => void;

  constructor(options: McpClientOptions) {
    this.url = options.url;
    this.onStateChange = options.onStateChange;
    this.onToolsUpdate = options.onToolsUpdate;
    this.onResourcesUpdate = options.onResourcesUpdate;
  }

  public connect() {
    this.setState('connecting');
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        this.setState('connected');
        this.initializeMcp();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (e) {
          console.error("MCP Client: Failed to parse message", e);
        }
      };

      this.ws.onerror = (error) => {
        console.error("MCP Client WebSocket Error:", error);
        this.setState('error', 'WebSocket connection error');
      };

      this.ws.onclose = () => {
        this.setState('disconnected');
      };
    } catch (error: any) {
      this.setState('error', error.message || 'Failed to initialize connection');
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private setState(state: McpConnectionState, error?: string) {
    if (this.onStateChange) {
      this.onStateChange(state, error);
    }
  }

  private handleMessage(data: any) {
    if (data.id && this.pendingRequests.has(data.id)) {
      const { resolve, reject } = this.pendingRequests.get(data.id)!;
      this.pendingRequests.delete(data.id);
      
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data.result);
      }
    } else if (data.method === 'notifications/tools/list_changed') {
      this.fetchTools();
    } else if (data.method === 'notifications/resources/list_changed') {
      this.fetchResources();
    }
  }

  private sendRequest(method: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return reject(new Error("Not connected"));
      }

      const id = this.messageId++;
      this.pendingRequests.set(id, { resolve, reject });

      const payload = {
        jsonrpc: "2.0",
        id,
        method,
        params
      };

      this.ws.send(JSON.stringify(payload));
      
      // Optional: Add timeout for requests
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error("Request timeout"));
        }
      }, 30000); // 30s timeout
    });
  }

  private async initializeMcp() {
    try {
      // 1. Initialize
      await this.sendRequest('initialize', {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: {
          name: "ReactMCPClient",
          version: "1.0.0"
        }
      });

      // 2. Send initialized notification
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          jsonrpc: "2.0",
          method: "notifications/initialized"
        }));
      }

      // 3. Fetch initial state
      this.fetchTools();
      this.fetchResources();

    } catch (err) {
      console.error("MCP Initialization failed:", err);
      this.setState('error', 'Failed to initialize MCP protocol');
    }
  }

  public async fetchTools() {
    try {
      const result = await this.sendRequest('tools/list');
      if (result && result.tools && this.onToolsUpdate) {
        this.onToolsUpdate(result.tools);
      }
    } catch (err) {
      console.error("Failed to fetch tools:", err);
    }
  }

  public async fetchResources() {
    try {
      const result = await this.sendRequest('resources/list');
      if (result && result.resources && this.onResourcesUpdate) {
        this.onResourcesUpdate(result.resources);
      }
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    }
  }

  public async callTool(name: string, args: Record<string, any>): Promise<any> {
    return this.sendRequest('tools/call', { name, arguments: args });
  }

  public async readResource(uri: string): Promise<any> {
    return this.sendRequest('resources/read', { uri });
  }
}
