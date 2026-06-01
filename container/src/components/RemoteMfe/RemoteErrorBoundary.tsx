import { Component } from "react";

import type { RemoteErrorBoundaryProps } from "@container/types/props";
import type { RemoteErrorBoundaryState } from "@container/types/states";

import "@container/components/RemoteMfe/RemoteErrorBoundary.css";

class RemoteErrorBoundary extends Component<RemoteErrorBoundaryProps, RemoteErrorBoundaryState> {
  constructor(props: RemoteErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown): RemoteErrorBoundaryState {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  override componentDidCatch(error: unknown, info: React.ErrorInfo): void {
    console.error("[MFE Load Error]", error, info);
  }

  override render(): React.ReactNode {
    if (this.state.error) {
      return (
        <div className="remote-mfe-error" role="alert">
          <h2 className="remote-mfe-error__title">This section is temporarily unavailable</h2>
          <p className="remote-mfe-error__message">{this.state.error.message}</p>
          <button type="button" className="remote-mfe-error__retry" onClick={this.props.onRetry}>
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RemoteErrorBoundary;
