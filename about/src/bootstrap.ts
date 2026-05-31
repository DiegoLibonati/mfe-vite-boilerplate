import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import AboutPageComponent from "@about/pages/about-page/about-page.component";

import { MFE_CALLBACKS } from "@about/tokens/mfe-callbacks.token";

import "@about/index.css";

const root = document.getElementById("root")! as HTMLDivElement;
const host = document.createElement("app-about-page");
root.appendChild(host);

bootstrapApplication(AboutPageComponent, {
  providers: [
    {
      provide: MFE_CALLBACKS,
      useValue: {
        onNavigate: (path: string): void => {
          window.location.href = path;
        },
      },
    },
  ],
}).catch(() => {
  // Empty fn
});
