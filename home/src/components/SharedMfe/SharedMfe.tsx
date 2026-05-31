import { useRef, useEffect } from "react";
import { useInheritedContext } from "shared/sdk";

import type { JSX } from "react";
import type { SharedMfeProps } from "@home/types/props";

import "@home/components/SharedMfe/SharedMfe.css";

const SharedMfe = <P,>({
  module,
  componentProps,
  wrapperClass,
}: SharedMfeProps<P>): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inherited = useInheritedContext();
  const propsRef = useRef(componentProps);
  propsRef.current = componentProps;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const options = inherited ? { callbacks: inherited.callbacks } : undefined;
    module.mount(container, propsRef.current, options);

    return (): void => {
      module.unmount(container);
    };
  }, [module, inherited]);

  // The host div owns the `<className>-wrapper` convention: it derives its class from the
  // mounted component's `className` so consumers don't need a manual wrapper element.
  // Pass `wrapperClass` to override the inferred name.
  const rawClassName = (componentProps as unknown as { className?: unknown }).className;
  const inferredWrapperClass =
    typeof rawClassName === "string" && rawClassName ? `${rawClassName}-wrapper` : undefined;
  const resolvedWrapperClass = wrapperClass ?? inferredWrapperClass;

  return (
    <div
      ref={containerRef}
      className={[resolvedWrapperClass, "shared-mfe__container"].filter(Boolean).join(" ")}
    />
  );
};

export default SharedMfe;
