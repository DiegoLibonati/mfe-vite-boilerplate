import { mount as sharedMount, unmount } from "shared/sdk";

import type { MfeMountOptions } from "shared/sdk";

import App from "@context/App";

import "@context/index.css";

const mount = (container: HTMLElement, options: MfeMountOptions): void => {
  container.dataset.mfe = "context";
  sharedMount(App, container, options);
};

export { mount, unmount };
