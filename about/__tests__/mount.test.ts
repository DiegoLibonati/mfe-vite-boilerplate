import { createApplication } from "@angular/platform-browser";
import { createComponent } from "@angular/core";

import type { MfeMountOptions } from "shared/sdk";

import { AboutPageComponent } from "@about/pages/about-page/about-page.component";

import { MFE_CALLBACKS } from "@about/tokens/mfe-callbacks.token";

import { mount, unmount } from "@about/mount";

const mockAttachView = jest.fn();
const mockDestroy = jest.fn();
const mockInjector = {};
const mockHostView = {};
const mockAppRef = {
  injector: mockInjector,
  attachView: mockAttachView,
  destroy: mockDestroy,
};
const mockComponentRef = {
  hostView: mockHostView,
};

jest.mock("shared/sdk", () => ({
  __esModule: true,
  LinkModule: { mount: jest.fn(), unmount: jest.fn() },
}));

jest.mock("@angular/platform-browser", () => {
  const actual: Record<string, unknown> = jest.requireActual("@angular/platform-browser");
  return { ...actual, createApplication: jest.fn() };
});

jest.mock("@angular/core", () => {
  const actual: Record<string, unknown> = jest.requireActual("@angular/core");
  return { ...actual, createComponent: jest.fn() };
});

describe("mount", () => {
  let container: HTMLElement;
  let options: MfeMountOptions;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    options = { callbacks: { onNavigate: jest.fn() } };

    (createApplication as jest.Mock).mockResolvedValue(mockAppRef);
    (createComponent as jest.Mock).mockReturnValue(mockComponentRef);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("mount", () => {
    it("should call createApplication with MFE_CALLBACKS provider", async () => {
      mount(container, options);
      await Promise.resolve();

      expect(createApplication).toHaveBeenCalledWith({
        providers: [{ provide: MFE_CALLBACKS, useValue: options.callbacks }],
      });
    });

    it("should append an app-about-page element to the container", async () => {
      mount(container, options);
      await Promise.resolve();

      const hostElement = container.querySelector<HTMLElement>("app-about-page");

      expect(hostElement).not.toBeNull();
    });

    it("should call createComponent with AboutPageComponent and the app injector", async () => {
      mount(container, options);
      await Promise.resolve();

      expect(createComponent).toHaveBeenCalledWith(AboutPageComponent, {
        environmentInjector: mockInjector,
        hostElement: expect.any(HTMLElement),
      });
    });

    it("should attach the component view to the application", async () => {
      mount(container, options);
      await Promise.resolve();

      expect(mockAttachView).toHaveBeenCalledWith(mockHostView);
    });

    it("should unmount the previous app before re-mounting the same container", async () => {
      mount(container, options);
      await Promise.resolve();

      mount(container, options);

      expect(mockDestroy).toHaveBeenCalledTimes(1);
    });

    it("should not throw when createApplication rejects", async () => {
      (createApplication as jest.Mock).mockRejectedValue(new Error("bootstrap failed"));

      mount(container, options);
      await Promise.resolve();

      expect(createApplication).toHaveBeenCalledTimes(1);
    });
  });

  describe("unmount", () => {
    it("should destroy the application when unmounting a mounted container", async () => {
      mount(container, options);
      await Promise.resolve();

      unmount(container);

      expect(mockDestroy).toHaveBeenCalledTimes(1);
    });

    it("should clear the container innerHTML when unmounting", async () => {
      mount(container, options);
      await Promise.resolve();

      unmount(container);

      expect(container.innerHTML).toBe("");
    });

    it("should not throw when unmounting a container that was not mounted", () => {
      expect(() => {
        unmount(container);
      }).not.toThrow();
    });
  });
});
