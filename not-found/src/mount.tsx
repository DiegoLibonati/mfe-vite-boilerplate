import { mount as sharedMount, unmount } from "shared/sdk";

import type { MfeMountOptions } from "shared/sdk";

import App from "@not-found/App";

import "@not-found/index.css";

const mount = (container: HTMLElement, options: MfeMountOptions): void => {
  container.dataset.mfe = "not-found";
  sharedMount(App, container, options);
};

export { mount, unmount };
