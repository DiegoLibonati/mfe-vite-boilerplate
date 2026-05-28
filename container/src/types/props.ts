import type { MfeModule, MfeCallbacks } from "@mfe/shared/types";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface RemoteMfeProps {
  loadModule: () => Promise<MfeModule | { default: MfeModule }>;
  callbacks: MfeCallbacks;
  mountData?: Record<string, unknown>;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export interface UsersAppProps {
  callbacks: MfeCallbacks;
}

export interface ProductAppProps {
  callbacks: MfeCallbacks;
}

export interface ContextAppProps {
  callbacks: MfeCallbacks;
}
