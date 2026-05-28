export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface RemoteMfeState {
  status: "loading" | "mounted" | "error";
  error: Error | null;
}
