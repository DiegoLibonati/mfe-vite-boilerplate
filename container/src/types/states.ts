export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface RemoteErrorBoundaryState {
  error: Error | null;
}
