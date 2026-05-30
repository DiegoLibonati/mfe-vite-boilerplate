import { Component, ViewEncapsulation } from "@angular/core";
import { LinkModule } from "shared/sdk";

import { SharedMfeComponent } from "@about/components/shared-mfe/shared-mfe.component";

@Component({
  selector: "app-about-page",
  standalone: true,
  imports: [SharedMfeComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./about-page.component.html",
  styleUrl: "./about-page.component.css",
})
export class AboutPageComponent {
  linkModule = LinkModule;

  productLinkProps = {
    id: "link-product",
    href: "/products/12",
    ariaLabel: "Go to Product Page 12",
    target: "_self",
    children: "Go to Product Page: 12",
  };

  contextLinkProps = {
    id: "link-context",
    href: "/context",
    ariaLabel: "Go to Context Page",
    target: "_self",
    children: "Go to Context Page",
  };
}
