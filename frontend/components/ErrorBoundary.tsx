"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CRITICAL CLIENT EXCEPTION:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-12 rounded-[40px] bg-rose-500/5 border border-rose-500/20 text-center mt-12">
          <div className="inline-flex p-4 bg-rose-500/20 rounded-2xl mb-6">
            <AlertTriangle className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Dataset could not be visualized</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            {this.props.fallbackMessage || "An unexpected error occurred while rendering the analysis. This often happens with malformed data or large result sets."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Try Re-rendering
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
