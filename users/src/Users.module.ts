import { createApp } from "vue";

import type { App as VueApp } from "vue";
import type { UsersMfeMountOptions } from "@users/types/mfe";

import UsersPage from "@users/pages/UsersPage/UsersPage.vue";

import "@users/index.css";

const apps = new Map<HTMLElement, VueApp>();

const mount = (container: HTMLElement, options: UsersMfeMountOptions): void => {
  container.dataset.mfe = "users";

  if (apps.has(container)) {
    unmount(container);
  }

  const app = createApp(UsersPage, { users: options.users });
  app.config.errorHandler = (error: unknown): void => {
    options.onError?.(error instanceof Error ? error : new Error(String(error)));
  };
  app.provide("mfeCallbacks", options.callbacks);
  apps.set(container, app);
  app.mount(container);
};

const unmount = (container: HTMLElement): void => {
  const app = apps.get(container);

  if (app) {
    app.unmount();
    apps.delete(container);
  }
};

export { mount, unmount };
