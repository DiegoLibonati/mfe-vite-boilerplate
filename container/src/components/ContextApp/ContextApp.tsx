import { useState, useCallback, useMemo } from "react";

import type { JSX } from "react";
import type { MfeCallbacks, MfeEvent } from "shared/sdk";
import type { ContextAppProps } from "@container/types/props";

import RemoteMfe from "@container/components/RemoteMfe/RemoteMfe";

import "@container/components/ContextApp/ContextApp.css";

const ContextApp = ({ callbacks }: ContextAppProps): JSX.Element => {
  const [counterValue, setCounterValue] = useState<number | null>(null);

  const loadModule = useCallback(() => import("context/ContextApp"), []);

  // No event type check needed — MfeEvent is a single-variant union for now
  const handleEvent = useCallback((event: MfeEvent): void => {
    setCounterValue(event.payload.counter);
  }, []);

  const enhancedCallbacks = useMemo(
    (): MfeCallbacks => ({
      ...callbacks,
      onEvent: handleEvent,
    }),
    [callbacks, handleEvent]
  );

  return (
    <div className="context-app">
      {counterValue !== null && (
        <div className="context-app__banner" role="status" aria-live="polite">
          <span className="context-app__banner-label">Counter value received by host:</span>
          <span className="context-app__banner-value">{counterValue}</span>
        </div>
      )}
      <RemoteMfe loadModule={loadModule} callbacks={enhancedCallbacks} />
    </div>
  );
};

export default ContextApp;
