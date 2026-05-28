import { render } from "@testing-library/react";
import { InheritedProvider } from "@mfe/shared";

import type { RenderResult } from "@testing-library/react";
import type { SharedComponentModule, MfeCallbacks } from "@mfe/shared/types/mfe";

import SharedMfe from "@/components/SharedMfe/SharedMfe";

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
});
