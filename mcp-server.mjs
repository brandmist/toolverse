import express from 'express';
import cors from 'cors';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { 
  ListToolsRequestSchema, 
  CallToolRequestSchema, 
  ListResourcesRequestSchema, 
  ReadResourceRequestSchema 
} from "@modelcontextprotocol/sdk/types.js";

const app = express();
app.use(cors());

const server = new Server(
  {
    name: "dummy-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    }
  }
);

// Register a dummy tool
server.setRequestHandler(
  ListToolsRequestSchema,
  async () => ({
    tools: [
      {
        name: "calculate_sum",
        description: "Add two numbers together",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" }
          },
          required: ["a", "b"]
        }
      },
      {
        name: "echo_message",
        description: "Echo a message back",
        inputSchema: {
          type: "object",
          properties: {
            message: { type: "string" }
          },
          required: ["message"]
        }
      }
    ]
  })
);

server.setRequestHandler(
  CallToolRequestSchema,
  async (request) => {
    const { name, arguments: args } = request.params;
    if (name === "calculate_sum") {
      return {
        content: [{ type: "text", text: `The sum is ${args.a + args.b}` }]
      };
    }
    if (name === "echo_message") {
      return {
        content: [{ type: "text", text: `You said: ${args.message}` }]
      };
    }
    throw new Error("Unknown tool");
  }
);

// Register a dummy resource
server.setRequestHandler(
  ListResourcesRequestSchema,
  async () => ({
    resources: [
      {
        uri: "file:///dummy/config.json",
        name: "Dummy Config",
        description: "A dummy configuration file",
        mimeType: "application/json"
      }
    ]
  })
);

server.setRequestHandler(
  ReadResourceRequestSchema,
  async (request) => {
    if (request.params.uri === "file:///dummy/config.json") {
      return {
        contents: [
          {
            uri: "file:///dummy/config.json",
            mimeType: "application/json",
            text: JSON.stringify({ mode: "test", version: 1.0 })
          }
        ]
      };
    }
    throw new Error("Unknown resource");
  }
);

let transport;

app.get('/sse', async (req, res) => {
  console.log("New SSE connection");
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post('/messages', async (req, res) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(500).send("No active SSE connection");
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Dummy MCP Server listening on http://localhost:${PORT}/sse`);
});
