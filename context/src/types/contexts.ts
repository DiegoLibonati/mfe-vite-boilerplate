import type { CounterState } from "@/types/states";

export interface CounterContext {
  counterState: CounterState;
  addCounter: (value: number) => void;
  subtractCounter: (value: number) => void;
}
