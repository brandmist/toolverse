import React, { useState, useEffect } from 'react';
import { useMcp } from '../context/McpContext';
import { Play, Loader2, Code } from 'lucide-react';

interface McpToolExecutorProps {
  toolName: string | null;
}

export const McpToolExecutor: React.FC<McpToolExecutorProps> = ({ toolName }) => {
  const { tools, callTool, state } = useMcp();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const tool = tools.find(t => t.name === toolName);

  useEffect(() => {
    // Reset state when tool changes
    setFormData({});
    setResult(null);
    setError(null);
  }, [toolName]);

  if (state !== 'connected' || !toolName || !tool) {
    return null;
  }

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await callTool(tool.name, formData);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'An error occurred during execution');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate simple form fields based on input schema if available
  const renderFormFields = () => {
    const properties = tool.inputSchema?.properties || {};
    const required = tool.inputSchema?.required || [];

    if (Object.keys(properties).length === 0) {
      return <p className="text-sm text-text-muted mb-4">This tool requires no arguments.</p>;
    }

    return Object.entries(properties).map(([key, prop]: [string, any]) => {
      const isRequired = required.includes(key);
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1">
            {key} {isRequired && <span className="text-danger">*</span>}
          </label>
          {prop.description && <p className="text-xs text-text-muted mb-2">{prop.description}</p>}
          <input
            type={prop.type === 'number' ? 'number' : 'text'}
            className="block w-full px-4 py-3 glass rounded-lg text-text-primary placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            value={formData[key] || ''}
            onChange={(e) => handleInputChange(key, prop.type === 'number' ? Number(e.target.value) : e.target.value)}
            required={isRequired}
          />
        </div>
      );
    });
  };

  return (
    <div className="glass-panel p-6 w-full mt-8">
      <h3 className="text-xl font-bold text-text-primary mb-2">Execute Tool: {tool.name}</h3>
      <p className="text-sm text-text-muted mb-6">{tool.description}</p>

      <form onSubmit={handleExecute} className="space-y-4">
        <div className="bg-surface border border-border p-5 rounded-lg shadow-inner">
          {renderFormFields()}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-button-primary hover:opacity-90 disabled:opacity-50 text-button-primary-text rounded-lg font-bold transition-all shadow-md"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          {isLoading ? 'Executing...' : 'Execute Tool'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 rounded-lg bg-surface border border-border border-border text-danger">
          <p className="font-medium">Execution Failed</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-text-primary flex items-center gap-2 mb-2">
            <Code className="w-4 h-4" /> Result
          </h4>
          <div className="bg-card border border-border rounded-lg border border-border p-4 overflow-x-auto">
            <pre className="text-xs text-text-primary font-mono">
              {typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
