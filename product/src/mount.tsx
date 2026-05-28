import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { InheritedProvider } from "@mfe/shared";

import type { Root } from "react-dom/client";
import type { ProductMfeMountOptions } from "@/types/mfe";

import App from "@/App";

import "@/index.css";

const roots = new Map<HTMLElement, Root>();

const mount = (container: HTMLElement, options: ProductMfeMountOptions): void => {
  container.dataset.mfe = "product";

  if (roots.has(container)) {
    unmount(container);
  }

  const root = createRoot(container);
  roots.set(container, root);

  root.render(
    <StrictMode>
      <InheritedProvider callbacks={options.callbacks}>
        <App productId={options.productId} />
      </InheritedProvider>
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
