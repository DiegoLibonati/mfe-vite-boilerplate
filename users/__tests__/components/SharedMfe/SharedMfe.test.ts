import { render } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import { vi } from "vitest";

import type { RenderResult } from "@testing-library/vue";
import type { Mock } from "vitest";
import type { MfeCallbacks, SharedComponentModule } from "shared/sdk";

import SharedMfe from "@users/components/SharedMfe/SharedMfe.vue";

import { mockCallbacks } from "@tests/__mocks__/callbacks.mock";

interface MockModule {
  module: SharedComponentModule<Record<string, unknown>>;
  mountSpy: Mock;
  unmountSpy: Mock;
}

interface RenderOptions {
  mockModule?: MockModule;
  loader?: Loader;
  componentProps?: Record<string, unknown>;
  callbacks?: MfeCallbacks | null;
  wrapperClass?: string;
  loadingClass?: string;
}

type Loader = () => Promise<SharedComponentModule<Record<string, unknown>>>;

const createMockModule = (): MockModule => {
  const mountSpy = vi.fn();
  const unmountSpy = vi.fn();
  return { mountSpy, unmountSpy, module: { mount: mountSpy, unmount: unmountSpy } };
};

const renderComponent = (
  options: RenderOptions = {}
): RenderResult & { mockModule: MockModule } => {
  const mockModule = options.mockModule ?? createMockModule();
  const loader: Loader =
    options.loader ??
    ((): Promise<SharedComponentModule<Record<string, unknown>>> =>
      Promise.resolve(mockModule.module));
  const componentProps = options.componentProps ?? { id: "test-prop" };
  const callbacks = options.callbacks === undefined ? mockCallbacks : options.callbacks;

  const provide: Record<string, unknown> = {};
  if (callbacks !== null) {
    provide.mfeCallbacks = callbacks;
  }

  const result = render(SharedMfe, {
    props: {
      loader,
      componentProps,
      ...(options.wrapperClass !== undefined ? { wrapperClass: options.wrapperClass } : {}),
      ...(options.loadingClass !== undefined ? { loadingClass: options.loadingClass } : {}),
    },
    global: { provide },
  });
  return { ...result, mockModule };
};

describe("SharedMfe", () => {
  describe("loading state", () => {
    it("should render a skeleton fallback before the module resolves", async () => {
      const pending: Loader = () =>
        new Promise<SharedComponentModule<Record<string, unknown>>>(() => {
          // Never resolves: keeps <Suspense> in its fallback state.
        });

      renderComponent({ loader: pending });
      await flushPromises();

      expect(document.querySelector<HTMLDivElement>(".skeleton-shimmer")).not.toBeNull();
    });

    it("should forward loadingClass to the skeleton fallback", async () => {
      const pending: Loader = () =>
        new Promise<SharedComponentModule<Record<string, unknown>>>(() => {
          // Never resolves: keeps <Suspense> in its fallback state.
        });

      renderComponent({ loader: pending, loadingClass: "demo-loader" });
      await flushPromises();

      expect(document.querySelector<HTMLDivElement>(".skeleton-shimmer")).toHaveClass(
        "demo-loader"
      );
    });
  });

  describe("lifecycle", () => {
    it("should mount with the container, componentProps and callbacks once loaded", async () => {
      const mockModule = createMockModule();
      const componentProps = { id: "link-1", href: "/test" };

      renderComponent({ mockModule, componentProps });
      await flushPromises();

      expect(mockModule.mountSpy).toHaveBeenCalledTimes(1);
      expect(mockModule.mountSpy).toHaveBeenCalledWith(expect.any(HTMLElement), componentProps, {
        callbacks: mockCallbacks,
      });
    });

    it("should mount with undefined options when no mfeCallbacks are provided", async () => {
      const mockModule = createMockModule();
      const componentProps = { id: "link-2" };

      renderComponent({ mockModule, componentProps, callbacks: null });
      await flushPromises();

      expect(mockModule.mountSpy).toHaveBeenCalledTimes(1);
      expect(mockModule.mountSpy).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        componentProps,
        undefined
      );
    });

    it("should unmount the module when the component is unmounted", async () => {
      const mockModule = createMockModule();

      const result = renderComponent({ mockModule });
      await flushPromises();

      result.unmount();

      expect(mockModule.unmountSpy).toHaveBeenCalledTimes(1);
      expect(mockModule.unmountSpy).toHaveBeenCalledWith(expect.any(HTMLElement));
    });
  });

  describe("error handling", () => {
    it("should log and render nothing when the loader rejects", async () => {
      vi.spyOn(console, "error").mockImplementation(() => undefined);
      const mockModule = createMockModule();

      renderComponent({ mockModule, loader: () => Promise.reject(new Error("boom")) });
      await flushPromises();

      expect(mockModule.mountSpy).not.toHaveBeenCalled();
      expect(document.querySelector<HTMLDivElement>(".skeleton-shimmer")).toBeNull();
    });
  });

  describe("wrapper class", () => {
    it("should infer a <className>-wrapper class on the host div", async () => {
      const mockModule = createMockModule();
      renderComponent({ mockModule, componentProps: { id: "x", className: "foo" } });
      await flushPromises();

      const hostDiv = mockModule.mountSpy.mock.calls[0]?.[0] as HTMLElement;

      expect(hostDiv).toHaveClass("foo-wrapper");
    });

    it("should let wrapperClass override the inferred name", async () => {
      const mockModule = createMockModule();
      renderComponent({
        mockModule,
        componentProps: { id: "x", className: "foo" },
        wrapperClass: "bar",
      });
      await flushPromises();

      const hostDiv = mockModule.mountSpy.mock.calls[0]?.[0] as HTMLElement;

      expect(hostDiv).toHaveClass("bar");
      expect(hostDiv).not.toHaveClass("foo-wrapper");
    });

    it("should add no class when componentProps has no className", async () => {
      const mockModule = createMockModule();
      renderComponent({ mockModule, componentProps: { id: "x" } });
      await flushPromises();

      const hostDiv = mockModule.mountSpy.mock.calls[0]?.[0] as HTMLElement;

      expect(hostDiv.className).toBe("");
    });
  });
});
