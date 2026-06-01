import { Suspense } from "react";
import DefaultLoading from "@shared/components/DefaultLoading/DefaultLoading";
import MfeErrorBoundary from "@shared/components/MfeErrorBoundary/MfeErrorBoundary";

import type { JSX } from "react";
import type { SharedMfeProps } from "@context/types/props";

const SharedMfe = <P extends object>({
  component: Component,
  componentProps,
  wrapperClass,
}: SharedMfeProps<P>): JSX.Element => {
  const rawClassName = (componentProps as { className?: unknown }).className;
  const inferredWrapperClass =
    typeof rawClassName === "string" && rawClassName ? `${rawClassName}-wrapper` : undefined;
  const resolvedWrapperClass = wrapperClass ?? inferredWrapperClass;

  return (
    <div data-mfe="shared" className={resolvedWrapperClass}>
      <MfeErrorBoundary>
        <Suspense fallback={<DefaultLoading />}>
          <Component {...componentProps} />
        </Suspense>
      </MfeErrorBoundary>
    </div>
  );
};

export default SharedMfe;
