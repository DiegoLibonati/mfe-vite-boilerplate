import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import type { ComponentType } from "react";
import type { Root } from "react-dom/client";
import type { MfeMountOptions } from "@mfe/shared/types/mfe";

import MfeErrorBoundary from "@mfe/shared/components/MfeErrorBoundary/MfeErrorBoundary";

import { InheritedProvider } from "@mfe/shared/contexts/InheritedContext/InheritedProvider";

const roots = new Map<HTMLElement, Root>();

const mount = (App: ComponentType, container: HTMLElement, options: MfeMountOptions): void => {
  const existingRoot = roots.get(container);
  if (existingRoot) {
    roots.delete(container);
    existingRoot.unmount();
  }

  const root = createRoot(container);
  roots.set(container, root);

  root.render(
    <StrictMode>
      <MfeErrorBoundary onError={options.onError}>
        <InheritedProvider callbacks={options.callbacks}>
          <App />
        </InheritedProvider>
      </MfeErrorBoundary>
    </StrictMode>
  );
};

const unmount = (container: HTMLElement): void => {
  const root = roots.get(container);

  if (root) {
    roots.delete(container);
    queueMicrotask(() => {
      root.unmount();
    });
  }
};

export { mount, unmount };
