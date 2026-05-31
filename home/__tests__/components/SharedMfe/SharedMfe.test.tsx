import { render } from "@testing-library/react";
import { InheritedProvider } from "shared/sdk";

import type { RenderResult } from "@testing-library/react";
import type { SharedComponentModule, MfeCallbacks } from "shared/sdk";

import SharedMfe from "@home/components/SharedMfe/SharedMfe";

interface TestProps {
  id: string;
  label: string;
}

const defaultComponentProps: TestProps = { id: "test-1", label: "Test Label" };

const createMockModule = (): SharedComponentModule<TestProps> => ({
  mount: jest.fn(),
  unmount: jest.fn(),
});

const renderComponent = (
  overrides: {
    module?: SharedComponentModule<TestProps>;
    componentProps?: TestProps;
    callbacks?: MfeCallbacks;
  } = {}
): RenderResult => {
  const module = overrides.module ?? createMockModule();
  const componentProps = overrides.componentProps ?? defaultComponentProps;

  const element = <SharedMfe module={module} componentProps={componentProps} />;

  if (overrides.callbacks) {
    return render(<InheritedProvider callbacks={overrides.callbacks}>{element}</InheritedProvider>);
  }

  return render(element);
};

describe("SharedMfe", () => {
  describe("rendering", () => {
    it("should render the container element", () => {
      const { container } = renderComponent();

      const mfeContainer = container.querySelector<HTMLDivElement>(".shared-mfe__container");

      expect(mfeContainer).not.toBeNull();
    });
  });

  describe("lifecycle", () => {
    it("should call module.mount with the container element and component props on mount", () => {
      const module = createMockModule();

      renderComponent({ module });

      expect(module.mount).toHaveBeenCalledTimes(1);
      expect(module.mount).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        defaultComponentProps,
        undefined
      );
    });

    it("should pass callbacks in options when wrapped in InheritedProvider", () => {
      const module = createMockModule();
      const callbacks: MfeCallbacks = { onNavigate: jest.fn() };

      renderComponent({ module, callbacks });

      expect(module.mount).toHaveBeenCalledWith(expect.any(HTMLDivElement), defaultComponentProps, {
        callbacks,
      });
    });

    it("should call module.unmount with the container element on unmount", () => {
      const module = createMockModule();
      const { unmount } = renderComponent({ module });
      const mountedContainer = (module.mount as jest.Mock).mock.calls[0][0];

      unmount();

      expect(module.unmount).toHaveBeenCalledTimes(1);
      expect(module.unmount).toHaveBeenCalledWith(mountedContainer);
    });
  });

  describe("wrapper class", () => {
    interface WrapperProps {
      id: string;
      className?: string;
    }

    const createWrapperModule = (): SharedComponentModule<WrapperProps> => ({
      mount: jest.fn(),
      unmount: jest.fn(),
    });

    it("should infer a <className>-wrapper class on the host and keep the base class", () => {
      const { container } = render(
        <SharedMfe module={createWrapperModule()} componentProps={{ id: "x", className: "foo" }} />
      );

      const host = container.querySelector<HTMLDivElement>(".shared-mfe__container");

      expect(host).toHaveClass("foo-wrapper", "shared-mfe__container");
    });

    it("should let wrapperClass override the inferred name", () => {
      const { container } = render(
        <SharedMfe
          module={createWrapperModule()}
          componentProps={{ id: "x", className: "foo" }}
          wrapperClass="bar"
        />
      );

      const host = container.querySelector<HTMLDivElement>(".shared-mfe__container");

      expect(host).toHaveClass("bar", "shared-mfe__container");
      expect(host).not.toHaveClass("foo-wrapper");
    });

    it("should add no wrapper class when componentProps has no className", () => {
      const { container } = render(
        <SharedMfe module={createWrapperModule()} componentProps={{ id: "x" }} />
      );

      const host = container.querySelector<HTMLDivElement>(".shared-mfe__container");

      expect(host?.className).toBe("shared-mfe__container");
    });
  });
});
