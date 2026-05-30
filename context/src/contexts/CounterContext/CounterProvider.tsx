import { useState, useEffect } from "react";
import { useInheritedContext } from "shared/sdk";

import type { JSX } from "react";
import type { CounterState } from "@context/types/states";
import type { CounterProviderProps } from "@context/types/props";

import { CounterContext } from "@context/contexts/CounterContext/CounterContext";

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
