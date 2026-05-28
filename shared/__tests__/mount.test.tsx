import { act } from "@testing-library/react";

import type { JSX } from "react";
import type { MfeMountOptions } from "@mfe/shared/types/mfe";

import { mount, unmount } from "@mfe/shared/mount";

const TestApp = (): JSX.Element => <div>Test App Content</div>;

const createMockOptions = (overrides: Partial<MfeMountOptions> = {}): MfeMountOptions => ({
  callbacks: { onNavigate: jest.fn() },
  ...overrides,
});

describe("mount", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(async () => {
    await act(async () => {
      unmount(container);
      await Promise.resolve();
    });
    container.remove();
  });

  describe("rendering", () => {
    it("should render the app into the container", () => {
      act(() => {
        mount(TestApp, container, createMockOptions());
      });

      expect(container).toHaveTextContent("Test App Content");
    });
  });

  describe("re-mounting", () => {
    it("should replace the existing app when mounting to the same container", () => {
      const AnotherApp = (): JSX.Element => <div>Another App</div>;

      act(() => {
        mount(TestApp, container, createMockOptions());
      });

      expect(container).toHaveTextContent("Test App Content");

      act(() => {
        mount(AnotherApp, container, createMockOptions());
      });

      expect(container).toHaveTextContent("Another App");
      expect(container).not.toHaveTextContent("Test App Content");
    });
  });

  describe("unmounting", () => {
    it("should clear the rendered content", async () => {
      act(() => {
        mount(TestApp, container, createMockOptions());
      });

      expect(container).toHaveTextContent("Test App Content");

      await act(async () => {
        unmount(container);
        await Promise.resolve();
      });

      expect(container).toBeEmptyDOMElement();
    });

    it("should not throw when unmounting a container that was never mounted", () => {
      const otherContainer = document.createElement("div");

      expect(() => {
        unmount(otherContainer);
      }).not.toThrow();
    });
  });

  describe("error handling", () => {
    it("should call onError when the app throws", () => {
      jest.spyOn(console, "error").mockImplementation();
      const mockOnError = jest.fn();
      const ErrorApp = (): never => {
        throw new Error("Boom");
      };

      act(() => {
        mount(ErrorApp, container, createMockOptions({ onError: mockOnError }));
      });

      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
