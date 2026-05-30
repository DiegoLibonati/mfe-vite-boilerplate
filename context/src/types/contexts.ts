import type { CounterState } from "@context/types/states";

export interface CounterContext {
  counterState: CounterState;
  addCounter: (value: number) => void;
  subtractCounter: (value: number) => void;
}
