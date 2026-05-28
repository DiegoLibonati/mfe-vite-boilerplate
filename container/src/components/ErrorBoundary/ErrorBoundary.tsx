import { Component } from "react";

import type { JSX } from "react";
import type { ErrorBoundaryProps } from "@/types/props";
import type { ErrorBoundaryState } from "@/types/states";

import "@/components/ErrorBoundary/ErrorBoundary.css";

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <h1 className="error-boundary__title">Something went wrong</h1>
          <p className="error-boundary__message">{this.state.error?.message}</p>
          <button
            type="button"
            className="error-boundary__retry"
            onClick={() => {
              this.setState({ hasError: false, error: null });
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundary = ({ children }: ErrorBoundaryProps): JSX.Element => {
  return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>;
};

export default ErrorBoundary;
