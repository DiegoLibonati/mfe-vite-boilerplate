import { Suspense } from "react";
import { SkeletonShimmer } from "shared/sdk";
import MfeErrorBoundary from "@shared/components/MfeErrorBoundary/MfeErrorBoundary";

import type { JSX } from "react";
import type { SharedMfeProps } from "@home/types/props";

const SharedMfe = <P extends object>({
  component: Component,
  componentProps,
  wrapperClass,
  loadingClass,
}: SharedMfeProps<P>): JSX.Element => {
  const rawClassName = (componentProps as { className?: unknown }).className;
  const inferredWrapperClass =
    typeof rawClassName === "string" && rawClassName ? `${rawClassName}-wrapper` : undefined;
  const resolvedWrapperClass = wrapperClass ?? inferredWrapperClass;

  return (
    <div data-mfe="shared" className={resolvedWrapperClass}>
      <MfeErrorBoundary>
        <Suspense fallback={<SkeletonShimmer className={loadingClass!} />}>
          <Component {...componentProps} />
        </Suspense>
      </MfeErrorBoundary>
    </div>
  );
};

export default SharedMfe;
