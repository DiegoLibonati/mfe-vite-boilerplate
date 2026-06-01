import { useEffect, useRef, useState } from "react";

import type { JSX } from "react";
import type { RemoteMountProps } from "@container/types/props";

import "@container/components/RemoteMfe/RemoteMount.css";

const RemoteMount = ({
  mod,
  callbacks,
  mountData,
  wrapperClass,
}: RemoteMountProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  if (error) throw error;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      try {
        mod.mount(container, {
          callbacks,
          onError: (err: Error): void => {
            setError(err);
          },
          ...mountData,
        });
        setMounted(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    });

    return (): void => {
      cancelled = true;
      mod.unmount(container);
    };
  }, [mod, callbacks, mountData]);

  return (
    <div
      ref={containerRef}
      className={[
        wrapperClass,
        "remote-mfe__container",
        !mounted ? "remote-mfe__container--hidden" : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
};

export default RemoteMount;
