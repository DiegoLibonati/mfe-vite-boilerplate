import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { AboutPageComponent } from "@/pages/about-page/about-page.component";

import { MFE_CALLBACKS } from "@/tokens/mfe-callbacks.token";

import "@/index.css";

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
