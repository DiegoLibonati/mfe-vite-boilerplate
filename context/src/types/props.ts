import type { SharedComponentModule } from "shared/sdk";

export interface SharedMfeProps<P> {
  module: SharedComponentModule<P>;
  componentProps: P;
}

export interface CounterProviderProps {
  children: React.ReactNode;
}
