import { useRef, useEffect } from "react";
import { useInheritedContext } from "@mfe/shared";

import type { JSX } from "react";
import type { SharedMfeProps } from "@/types/props";

import "@/components/SharedMfe/SharedMfe.css";

const SharedMfe = <P,>({ module, componentProps }: SharedMfeProps<P>): JSX.Element => {
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

  return <div ref={containerRef} className="shared-mfe__container" />;
};

export default SharedMfe;
