import { act } from "@testing-library/react";

import type { JSX } from "react";
import type { MfeMountOptions } from "@shared/types/mfe";

import { createComponentMount } from "@shared/helpers/createComponentMount";

interface TestProps {
  text: string;
}

const TestComponent = ({ text }: TestProps): JSX.Element => <div>{text}</div>;

describe("createComponentMount", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should return mount and unmount functions", () => {
    const result = createComponentMount<TestProps>(TestComponent);

    expect(typeof result.mount).toBe("function");
    expect(typeof result.unmount).toBe("function");
  });

  describe("mount", () => {
    it("should render the component with the provided props", () => {
      const { mount } = createComponentMount<TestProps>(TestComponent);

      act(() => {
        mount(container, { text: "Hello" });
      });

      expect(container).toHaveTextContent("Hello");
    });

    it("should render without InheritedProvider when options are not provided", () => {
      const { mount } = createComponentMount<TestProps>(TestComponent);

      act(() => {
        mount(container, { text: "No provider" });
      });

      expect(container).toHaveTextContent("No provider");
    });

    it("should render with InheritedProvider when callbacks are provided", () => {
      const { mount } = createComponentMount<TestProps>(TestComponent);
      const options: MfeMountOptions = {
        callbacks: { onNavigate: jest.fn() },
      };

      act(() => {
        mount(container, { text: "With provider" }, options);
      });

      expect(container).toHaveTextContent("With provider");
    });

    it("should reuse the existing root when mounting to the same container", () => {
      const { mount } = createComponentMount<TestProps>(TestComponent);

      act(() => {
        mount(container, { text: "First" });
      });

      act(() => {
        mount(container, { text: "Second" });
      });

      expect(container).toHaveTextContent("Second");
      expect(container).not.toHaveTextContent("First");
    });
  });

  describe("unmount", () => {
    it("should clear the rendered content", () => {
      const { mount, unmount } = createComponentMount<TestProps>(TestComponent);

      act(() => {
        mount(container, { text: "To be removed" });
      });

      expect(container).toHaveTextContent("To be removed");

      act(() => {
        unmount(container);
      });

      expect(container).toBeEmptyDOMElement();
    });

    it("should not throw when unmounting a container that was never mounted", () => {
      const { unmount } = createComponentMount<TestProps>(TestComponent);
      const otherContainer = document.createElement("div");

      expect(() => {
        act(() => {
          unmount(otherContainer);
        });
      }).not.toThrow();
    });
  });
});
