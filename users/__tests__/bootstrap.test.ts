import { vi } from "vitest";

import type * as Vue from "vue";

import App from "@users/App.vue";

const { mockCreateApp, mockProvide, mockMount } = vi.hoisted(() => {
  const mockProvide = vi.fn((_token: string, _value: unknown) => undefined);
  const mockMount = vi.fn((_target: unknown) => undefined);
  const mockApp = { provide: mockProvide, mount: mockMount };
  const mockCreateApp = vi.fn((_rootComponent: unknown) => mockApp);
  return { mockCreateApp, mockProvide, mockMount };
});

let createAppArg: unknown;
let provideToken: unknown;
let provideValue: { onNavigate: (path: string) => void };
let mountTarget: unknown;

vi.mock("vue", async () => {
  const actual = await vi.importActual<typeof Vue>("vue");
  return { ...actual, createApp: mockCreateApp };
});

vi.mock("shared/sdk", () => ({
  LinkModule: { mount: vi.fn(), unmount: vi.fn() },
}));

describe("bootstrap", () => {
  beforeAll(async () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);

    await import("@users/bootstrap");

    createAppArg = mockCreateApp.mock.calls[0]?.[0];
    provideToken = mockProvide.mock.calls[0]?.[0];
    provideValue = mockProvide.mock.calls[0]?.[1] as { onNavigate: (path: string) => void };
    mountTarget = mockMount.mock.calls[0]?.[0];
  });

  afterAll(() => {
    document.body.innerHTML = "";
  });

  it("should call createApp with the App component", () => {
    expect(createAppArg).toBe(App);
  });

  it("should provide an mfeCallbacks token", () => {
    expect(provideToken).toBe("mfeCallbacks");
  });

  it("should provide an mfeCallbacks value with an onNavigate function", () => {
    expect(typeof provideValue.onNavigate).toBe("function");
  });

  it("should mount the app on the #root element", () => {
    const rootEl = document.querySelector<HTMLDivElement>("#root");

    expect(mountTarget).toBe(rootEl);
  });

  describe("onNavigate", () => {
    let originalLocation: Location;

    beforeEach(() => {
      originalLocation = window.location;
      Object.defineProperty(window, "location", {
        configurable: true,
        writable: true,
        value: { href: "" },
      });
    });

    afterEach(() => {
      Object.defineProperty(window, "location", {
        configurable: true,
        writable: true,
        value: originalLocation,
      });
    });

    it("should set window.location.href to the provided path", () => {
      provideValue.onNavigate("/destination");

      expect(window.location.href).toBe("/destination");
    });
  });
});
