export interface MfeCounterChangeEvent {
  type: "counterChange";
  payload: { counter: number };
}

export type MfeEvent = MfeCounterChangeEvent;

export interface MfeCallbacks {
  onNavigate: (path: string) => void;
  onEvent?: ((event: MfeEvent) => void) | undefined;
}

export interface MfeMountOptions {
  callbacks: MfeCallbacks;
  onError?: (error: Error) => void;
}

export interface MfeModule {
  mount: (container: HTMLElement, options: MfeMountOptions) => void;
  unmount: (container: HTMLElement) => void;
}

export interface SharedComponentModule<P = object> {
  mount: (container: HTMLElement, props: P, options?: MfeMountOptions) => void;
  unmount: (container: HTMLElement) => void;
}
