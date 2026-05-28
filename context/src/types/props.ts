import type { SharedComponentModule } from "@mfe/shared/types";

export interface SharedMfeProps<P> {
  module: SharedComponentModule<P>;
  componentProps: P;
}

export interface CounterProviderProps {
  children: React.ReactNode;
}
