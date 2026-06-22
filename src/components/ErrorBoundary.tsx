import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// @ts-ignore
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // @ts-ignore
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    // @ts-ignore
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
          <div className="bg-card border border-border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 bg-surface border border-border rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-danger" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">Something went wrong</h2>
            <p className="text-text-muted mb-8 max-w-sm">
              An unexpected error occurred in this tool or page. Please try refreshing or return home.
            </p>
            {/* @ts-ignore */}
            {this.state.error && (
              <div className="w-full text-left bg-black/50 p-4 rounded-xl border border-white/5 mb-8 overflow-auto max-h-32">
                {/* @ts-ignore */}
                <p className="text-danger font-mono text-xs">{this.state.error.toString()}</p>
              </div>
            )}
            <div className="flex gap-4 w-full justify-center">
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-white/10 hover:bg-white/10 text-text-primary flex-1"
              >
                Go Home
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-card border border-border hover:bg-card-hover text-text-primary flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}
