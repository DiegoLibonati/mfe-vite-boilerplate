import { bootstrapApplication } from "@angular/platform-browser";

import { AboutPageComponent } from "@about/pages/about-page/about-page.component";

import { MFE_CALLBACKS } from "@about/tokens/mfe-callbacks.token";

let bootstrapCallComponent: unknown;
let bootstrapCallConfig: Record<string, unknown>;

jest.mock("@angular/platform-browser", () => {
  const actual: Record<string, unknown> = jest.requireActual("@angular/platform-browser");
  return { ...actual, bootstrapApplication: jest.fn().mockReturnValue(Promise.resolve()) };
});

jest.mock("shared/sdk", () => ({
  __esModule: true,
  LinkModule: { mount: jest.fn(), unmount: jest.fn() },
}));

describe("bootstrap", () => {
  beforeAll(async () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);

    await import("@about/bootstrap");

    const callArgs = (bootstrapApplication as jest.Mock).mock.calls[0];
    bootstrapCallComponent = callArgs[0];
    bootstrapCallConfig = callArgs[1] as Record<string, unknown>;
  });

  afterAll(() => {
    document.body.innerHTML = "";
  });

  it("should call bootstrapApplication with AboutPageComponent", () => {
    expect(bootstrapCallComponent).toBe(AboutPageComponent);
  });

  it("should append an app-about-page element to the root", () => {
    const appElement = document
      .querySelector<HTMLDivElement>("#root")
      ?.querySelector<HTMLElement>("app-about-page");

    expect(appElement).not.toBeNull();
  });

  it("should provide MFE_CALLBACKS in the bootstrap providers", () => {
    const providers = bootstrapCallConfig.providers as {
      provide: unknown;
      useValue: unknown;
    }[];
    const mfeProvider = providers.find((p) => p.provide === MFE_CALLBACKS);

    expect(mfeProvider).toBeDefined();
  });

  it("should provide an onNavigate callback in MFE_CALLBACKS", () => {
    const providers = bootstrapCallConfig.providers as {
      provide: unknown;
      useValue: Record<string, unknown>;
    }[];
    const mfeProvider = providers.find((p) => p.provide === MFE_CALLBACKS);

    expect(typeof mfeProvider?.useValue.onNavigate).toBe("function");
  });
});
