import { useState, useEffect } from "react";
import { useInheritedContext } from "@mfe/shared";

import type { JSX } from "react";
import type { CounterState } from "@/types/states";
import type { CounterProviderProps } from "@/types/props";

import { CounterContext } from "@/contexts/CounterContext/CounterContext";

export const CounterProvider = ({ children }: CounterProviderProps): JSX.Element => {
  const inherited = useInheritedContext();

  const [counterState, setCounterState] = useState<CounterState>({
    counter: 0,
  });

  const addCounter = (value = 1): void => {
    setCounterState((state) => ({ ...state, counter: state.counter + value }));
  };

  const subtractCounter = (value = 1): void => {
    setCounterState((state) => ({ ...state, counter: state.counter - value }));
  };

  useEffect(() => {
    inherited?.callbacks.onEvent?.({
      type: "counterChange",
      payload: { counter: counterState.counter },
    });
  }, [counterState.counter, inherited]);

  return (
    <CounterContext.Provider
      value={{
        counterState: counterState,
        addCounter: addCounter,
        subtractCounter: subtractCounter,
      }}
    >
      {children}
    </CounterContext.Provider>
  );
};
