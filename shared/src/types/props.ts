import type { MfeCallbacks } from "@shared/types/mfe";

export interface DefaultProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LinkProps extends DefaultProps {
  id: string;
  href: string;
  ariaLabel: string;
  target?: string;
}

export interface ActionProps extends DefaultProps {
  id: string;
  ariaLabel: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export interface InheritedProviderProps {
  children: React.ReactNode;
  callbacks: MfeCallbacks;
}

export interface MfeErrorBoundaryProps {
  children: React.ReactNode;
  onError?: ((error: Error) => void) | undefined;
}
