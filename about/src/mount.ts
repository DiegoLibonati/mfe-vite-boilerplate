import "zone.js";
import { createApplication } from "@angular/platform-browser";
import { createComponent } from "@angular/core";

import type { ApplicationRef } from "@angular/core";
import type { MfeMountOptions } from "@mfe/shared/types/mfe";

import { AboutPageComponent } from "@/pages/about-page/about-page.component";

import { MFE_CALLBACKS } from "@/tokens/mfe-callbacks.token";

import "@/index.css";

const apps = new Map<HTMLElement, ApplicationRef>();

const mount = (container: HTMLElement, options: MfeMountOptions): void => {
  container.dataset.mfe = "about";

  if (apps.has(container)) {
    unmount(container);
  }

  createApplication({
    providers: [
      {
        provide: MFE_CALLBACKS,
        useValue: options.callbacks,
      },
    ],
  })
    .then((appRef: ApplicationRef) => {
      apps.set(container, appRef);

      const hostElement = document.createElement("app-about-page");
      container.appendChild(hostElement);

      const componentRef = createComponent(AboutPageComponent, {
        environmentInjector: appRef.injector,
        hostElement,
      });

      appRef.attachView(componentRef.hostView);
    })
    .catch((error: unknown) => {
      options.onError?.(error instanceof Error ? error : new Error(String(error)));
    });
};

const unmount = (container: HTMLElement): void => {
  const appRef = apps.get(container);

  if (appRef) {
    apps.delete(container);
    appRef.destroy();
    container.innerHTML = "";
  }
};

export { mount, unmount };
