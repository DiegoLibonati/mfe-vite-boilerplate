import { TestBed, type ComponentFixture } from "@angular/core/testing";
import { screen } from "@testing-library/dom";

import type { SharedComponentModule } from "shared/sdk";

import { AboutPageComponent } from "@about/pages/about-page/about-page.component";

import { MFE_CALLBACKS } from "@about/tokens/mfe-callbacks.token";

import { resolveAngularTemplates } from "@tests/__mocks__/resolve-templates.mock";
import { mockCallbacks } from "@tests/__mocks__/callbacks.mock";

interface RenderResult {
  fixture: ComponentFixture<AboutPageComponent>;
  component: AboutPageComponent;
}

let mockLinkMount: jest.Mock;

jest.mock("shared/sdk", () => ({
  __esModule: true,
  LinkModule: {
    mount: jest.fn(),
    unmount: jest.fn(),
  },
}));

beforeAll(async () => {
  const { LinkModule } = await import("shared/sdk");
  mockLinkMount = (LinkModule as unknown as SharedComponentModule).mount as jest.Mock;
  await resolveAngularTemplates();
});

const renderPage = async (): Promise<RenderResult> => {
  await TestBed.configureTestingModule({
    imports: [AboutPageComponent],
    providers: [{ provide: MFE_CALLBACKS, useValue: mockCallbacks }],
  }).compileComponents();

  const fixture = TestBed.createComponent(AboutPageComponent);
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance };
};

describe("AboutPageComponent", () => {
  describe("rendering", () => {
    it("should render the page heading", async () => {
      await renderPage();

      expect(screen.getByRole("heading", { name: "About Page", level: 1 })).toBeInTheDocument();
    });

    it("should render the page navigation", async () => {
      await renderPage();

      expect(screen.getByRole("navigation", { name: "Page navigation" })).toBeInTheDocument();
    });

    it("should render two list items in the navigation", async () => {
      await renderPage();

      const listItems = screen.getAllByRole("listitem");

      expect(listItems).toHaveLength(2);
    });
  });

  describe("behavior", () => {
    it("should mount the link module twice", async () => {
      await renderPage();

      expect(mockLinkMount).toHaveBeenCalledTimes(2);
    });

    it("should pass productLinkProps to a shared-mfe component", async () => {
      await renderPage();

      expect(mockLinkMount).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        {
          id: "link-product",
          href: "/products/12",
          ariaLabel: "Go to Product Page 12",
          target: "_self",
          children: "Go to Product Page: 12",
        },
        expect.objectContaining({ callbacks: mockCallbacks })
      );
    });

    it("should pass contextLinkProps to a shared-mfe component", async () => {
      await renderPage();

      expect(mockLinkMount).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        {
          id: "link-context",
          href: "/context",
          ariaLabel: "Go to Context Page",
          target: "_self",
          children: "Go to Context Page",
        },
        expect.objectContaining({ callbacks: mockCallbacks })
      );
    });
  });
});
