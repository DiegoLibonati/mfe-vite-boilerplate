import { mount as sharedMount, unmount } from "@mfe/shared";

import type { MfeMountOptions } from "@mfe/shared/types";

import App from "@/App";

import "@/index.css";

const mount = (container: HTMLElement, options: MfeMountOptions): void => {
  container.dataset.mfe = "notfound";
  sharedMount(App, container, options);
};

export { mount, unmount };
