import { mount as sharedMount, unmount } from "shared/sdk";

import type { MfeMountOptions } from "shared/sdk";

import App from "@home/App";

import "@home/index.css";

const mount = (container: HTMLElement, options: MfeMountOptions): void => {
  container.dataset.mfe = "home";
  sharedMount(App, container, options);
};

export { mount, unmount };
