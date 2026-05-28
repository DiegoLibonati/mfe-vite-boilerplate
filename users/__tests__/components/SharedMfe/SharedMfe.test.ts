import { render } from "@testing-library/vue";
import { vi } from "vitest";

import type { RenderResult } from "@testing-library/vue";
import type { Mock } from "vitest";
import type { MfeCallbacks, SharedComponentModule } from "@mfe/shared/types";

import SharedMfe from "@/components/SharedMfe/SharedMfe.vue";

import { mockCallbacks } from "@tests/__mocks__/callbacks.mock";

interface MockModule {
  module: SharedComponentModule<Record<string, unknown>>;
  mountSpy: Mock;
  unmountSpy: Mock;
}

interface RenderOptions {
  mockModule?: MockModule;
  componentProps?: Record<string, unknown>;
  callbacks?: MfeCallbacks | null;
}

const createMockModule = (): MockModule => {
  const mountSpy = vi.fn();
  const unmountSpy = vi.fn();
  return {
    mountSpy,
    unmountSpy,
    module: { mount: mountSpy, unmount: unmountSpy },
  };
};

const renderComponent = (
  options: RenderOptions = {}
): RenderResult & { mockModule: MockModule } => {
  const mockModule = options.mockModule ?? createMockModule();
  const componentProps = options.componentProps ?? { id: "test-prop" };
  const callbacks = options.callbacks === undefined ? mockCallbacks : options.callbacks;

  const provide: Record<string, unknown> = {};
  if (callbacks !== null) {
    provide.mfeCallbacks = callbacks;
  }

  const result = render(SharedMfe, {
    props: { module: mockModule.module, componentProps },
    global: { provide },
  });

  return { ...result, mockModule };
};

describe("SharedMfe", () => {
  describe("rendering", () => {
    it("should render a container div", () => {
      const { container } = renderComponent();

      const div = container.querySelector<HTMLDivElement>("div");

      expect(div).not.toBeNull();
    });
  });

  describe("lifecycle", () => {
    it("should call module.mount with the container element, componentProps and callbacks on mount", () => {
      const mockModule = createMockModule();
      const componentProps = { id: "link-1", href: "/test" };

      const { container } = renderComponent({ mockModule, componentProps });

      const div = container.querySelector<HTMLDivElement>("div");

      expect(mockModule.mountSpy).toHaveBeenCalledTimes(1);
      expect(mockModule.mountSpy).toHaveBeenCalledWith(div, componentProps, {
        callbacks: mockCallbacks,
      });
    });

    it("should call module.mount with undefined options when no mfeCallbacks are provided", () => {
      vi.spyOn(console, "warn").mockImplementation(() => undefined);
      const mockModule = createMockModule();
      const componentProps = { id: "link-2" };

      const { container } = renderComponent({ mockModule, componentProps, callbacks: null });

      const div = container.querySelector<HTMLDivElement>("div");

      expect(mockModule.mountSpy).toHaveBeenCalledTimes(1);
      expect(mockModule.mountSpy).toHaveBeenCalledWith(div, componentProps, undefined);
    });

    it("should call module.unmount with the container element when the component is unmounted", () => {
      const mockModule = createMockModule();

      const result = renderComponent({ mockModule });
      const div = result.container.querySelector<HTMLDivElement>("div");

      result.unmount();

      expect(mockModule.unmountSpy).toHaveBeenCalledTimes(1);
      expect(mockModule.unmountSpy).toHaveBeenCalledWith(div);
    });
  });
});
