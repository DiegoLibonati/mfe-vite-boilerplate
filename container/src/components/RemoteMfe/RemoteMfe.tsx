import { useRef, useEffect, useState, useCallback } from "react";

import type { JSX } from "react";
import type { MfeModule } from "@mfe/shared/types";
import type { RemoteMfeProps } from "@/types/props";
import type { RemoteMfeState } from "@/types/states";

import DefaultLoading from "@/components/DefaultLoading/DefaultLoading";

import "@/components/RemoteMfe/RemoteMfe.css";

const INITIAL_STATE: RemoteMfeState = { status: "loading", error: null };

const RemoteMfe = ({
  loadModule,
  callbacks,
  mountData,
  loadingFallback,
  errorFallback,
}: RemoteMfeProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const moduleRef = useRef<MfeModule | null>(null);
  const [remoteState, setRemoteState] = useState<RemoteMfeState>(INITIAL_STATE);
  const [retryKey, setRetryKey] = useState(0);

  const handleRetry = useCallback((): void => {
    setRemoteState(INITIAL_STATE);
    moduleRef.current = null;
    setRetryKey((k) => k + 1);
  }, []);

  const handleMfeError = useCallback((error: Error): void => {
    setRemoteState({ status: "error", error });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    const loadAndMount = async (): Promise<void> => {
      try {
        const raw = await loadModule();
        const mod: MfeModule = "default" in raw ? raw.default : raw;

        if (cancelled) return;

        moduleRef.current = mod;
        mod.mount(container, { callbacks, onError: handleMfeError, ...mountData });
        setRemoteState({ status: "mounted", error: null });
      } catch (err) {
        if (cancelled) return;
        console.error("[MFE Load Error]", err);
        setRemoteState({
          status: "error",
          error: err instanceof Error ? err : new Error(String(err)),
        });
      }
    };

    void loadAndMount();

    return (): void => {
      cancelled = true;
      if (moduleRef.current) {
        moduleRef.current.unmount(container);
        moduleRef.current = null;
      }
    };
  }, [loadModule, callbacks, mountData, retryKey, handleMfeError]);

  return (
    <>
      {remoteState.status === "loading" && (loadingFallback ?? <DefaultLoading />)}
      {remoteState.status === "error" &&
        (errorFallback ?? (
          <div className="remote-mfe-error" role="alert">
            <h2 className="remote-mfe-error__title">This section is temporarily unavailable</h2>
            <p className="remote-mfe-error__message">{remoteState.error?.message}</p>
            <button type="button" className="remote-mfe-error__retry" onClick={handleRetry}>
              Retry
            </button>
          </div>
        ))}
      <div
        ref={containerRef}
        className={`remote-mfe__container${remoteState.status !== "mounted" ? " remote-mfe__container--hidden" : ""}`}
      />
    </>
  );
};

export default RemoteMfe;
