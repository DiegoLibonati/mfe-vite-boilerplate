import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import type { ComponentType } from "react";
import type { Root } from "react-dom/client";
import type { MfeMountOptions, SharedComponentModule } from "@shared/types/mfe";

import MfeErrorBoundary from "@shared/components/MfeErrorBoundary/MfeErrorBoundary";

import { InheritedProvider } from "@shared/contexts/InheritedContext/InheritedProvider";

const createComponentMount = <P extends object>(
  Component: ComponentType<P>
): SharedComponentModule<P> => {
  const roots = new WeakMap<HTMLElement, Root>();

  const mount = (container: HTMLElement, props: P, options?: MfeMountOptions): void => {
    let root = roots.get(container);

    if (!root) {
      container.dataset.mfe = "shared";
      root = createRoot(container);
      roots.set(container, root);
    }

    const element = (
      <StrictMode>
        <MfeErrorBoundary onError={options?.onError}>
          {options?.callbacks ? (
            <InheritedProvider callbacks={options.callbacks}>
              <Component {...props} />
            </InheritedProvider>
          ) : (
            <Component {...props} />
          )}
        </MfeErrorBoundary>
      </StrictMode>
    );

    root.render(element);
  };

  const unmount = (container: HTMLElement): void => {
    const root = roots.get(container);

    if (root) {
      root.render(null);
    }
  };

  return { mount, unmount };
};

export { createComponentMount };
