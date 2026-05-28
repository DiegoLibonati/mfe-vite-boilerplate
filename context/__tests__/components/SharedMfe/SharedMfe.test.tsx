import { render } from "@testing-library/react";
import { InheritedProvider } from "@mfe/shared";

import type { RenderResult } from "@testing-library/react";
import type { SharedMfeProps } from "@/types/props";
import type { SharedComponentModule, MfeCallbacks } from "@mfe/shared/types";

import SharedMfe from "@/components/SharedMfe/SharedMfe";

import { mockModule, mockMount, mockUnmount } from "@tests/__mocks__/module.mock";

interface TestProps {
  label: string;
}

const defaultComponentProps: TestProps = { label: "test" };

const renderComponent = (props: Partial<SharedMfeProps<TestProps>> = {}): RenderResult => {
  const defaultProps: SharedMfeProps<TestProps> = {
    module: mockModule,
    componentProps: defaultComponentProps,
    ...props,
  };
  return render(<SharedMfe {...defaultProps} />);
};

describe("SharedMfe", () => {
  describe("rendering", () => {
    it("should render a container div with the shared-mfe class", () => {
      const { container } = renderComponent();

      const div = container.querySelector<HTMLDivElement>(".shared-mfe__container");

      expect(div).toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    it("should call module.mount with the container, props, and no options on mount", () => {
      renderComponent();

      expect(mockMount).toHaveBeenCalledTimes(1);
      expect(mockMount).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        defaultComponentProps,
        undefined
      );
    });

    it("should call module.unmount with the container on cleanup", () => {
      const { unmount } = renderComponent();

      unmount();

      expect(mockUnmount).toHaveBeenCalledTimes(1);
      expect(mockUnmount).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it("should pass the same container element to mount and unmount", () => {
      const { container, unmount } = renderComponent();
      const div = container.querySelector<HTMLDivElement>(".shared-mfe__container");

      unmount();

      expect(mockMount.mock.calls[0][0]).toBe(div);
      expect(mockUnmount.mock.calls[0][0]).toBe(div);
    });

    it("should pass callbacks in options when InheritedContext is available", () => {
      const mockOnNavigate = jest.fn();
      const mockCallbacks: MfeCallbacks = { onNavigate: mockOnNavigate };

      render(
        <InheritedProvider callbacks={mockCallbacks}>
          <SharedMfe module={mockModule} componentProps={defaultComponentProps} />
        </InheritedProvider>
      );

      expect(mockMount).toHaveBeenCalledWith(expect.any(HTMLDivElement), defaultComponentProps, {
        callbacks: mockCallbacks,
      });
    });

    it("should unmount old module and mount new module when module prop changes", () => {
      const mockOldMount = jest.fn();
      const mockOldUnmount = jest.fn();
      const mockNewMount = jest.fn();

      const oldModule: SharedComponentModule<TestProps> = {
        mount: mockOldMount,
        unmount: mockOldUnmount,
      };
      const newModule: SharedComponentModule<TestProps> = {
        mount: mockNewMount,
        unmount: jest.fn(),
      };

      const { rerender } = render(
        <SharedMfe module={oldModule} componentProps={defaultComponentProps} />
      );

      expect(mockOldMount).toHaveBeenCalledTimes(1);

      rerender(<SharedMfe module={newModule} componentProps={defaultComponentProps} />);

      expect(mockOldUnmount).toHaveBeenCalledTimes(1);
      expect(mockNewMount).toHaveBeenCalledTimes(1);
    });
  });
});
