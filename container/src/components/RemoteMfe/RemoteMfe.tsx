import { Suspense, lazy, useMemo, useState } from "react";
import { DefaultLoading } from "shared/sdk";

import type { JSX } from "react";
import type { MfeModule } from "shared/sdk";
import type { RemoteMfeProps } from "@container/types/props";

import RemoteMount from "@container/components/RemoteMfe/RemoteMount";
import RemoteErrorBoundary from "@container/components/RemoteMfe/RemoteErrorBoundary";

const RemoteMfe = ({
  loadModule,
  callbacks,
  mountData,
  wrapperClass,
}: RemoteMfeProps): JSX.Element => {
  const [retryKey, setRetryKey] = useState(0);

  const rawClassName = mountData?.className;
  const inferredWrapperClass =
    typeof rawClassName === "string" && rawClassName ? `${rawClassName}-wrapper` : undefined;
  const resolvedWrapperClass = wrapperClass ?? inferredWrapperClass;

  const LazyRemote = useMemo(
    () =>
      lazy(async () => {
        const raw = await loadModule();
        const mod: MfeModule = "default" in raw ? raw.default : raw;
        return {
          default: (): JSX.Element => (
            <RemoteMount
              mod={mod}
              callbacks={callbacks}
              mountData={mountData}
              wrapperClass={resolvedWrapperClass}
            />
          ),
        };
      }),
    [loadModule, callbacks, mountData, resolvedWrapperClass, retryKey]
  );

  const handleRetry = (): void => {
    setRetryKey((key) => key + 1);
  };

  return (
    <RemoteErrorBoundary key={retryKey} onRetry={handleRetry}>
      <Suspense
        fallback={
          <div data-mfe="shared">
            <DefaultLoading />
          </div>
        }
      >
        <LazyRemote />
      </Suspense>
    </RemoteErrorBoundary>
  );
};

export default RemoteMfe;
