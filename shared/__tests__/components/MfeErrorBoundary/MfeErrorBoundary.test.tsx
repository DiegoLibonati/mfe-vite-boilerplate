import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";
import type { MfeErrorBoundaryProps } from "@shared/types/props";

import MfeErrorBoundary from "@shared/components/MfeErrorBoundary/MfeErrorBoundary";

const ThrowingComponent = (): never => {
  throw new Error("Test error");
};

const renderComponent = (props: Partial<MfeErrorBoundaryProps> = {}): RenderResult => {
  const { children = <div>Child content</div>, ...rest } = props;

  return render(<MfeErrorBoundary {...rest}>{children}</MfeErrorBoundary>);
};

describe("MfeErrorBoundary", () => {
  describe("when no error occurs", () => {
    it("should render the children", () => {
      renderComponent();

      expect(screen.getByText("Child content")).toBeInTheDocument();
    });
  });

  describe("when an error occurs", () => {
    it("should render nothing", () => {
      jest.spyOn(console, "error").mockImplementation();
      const { container } = renderComponent({ children: <ThrowingComponent /> });

      expect(container).toBeEmptyDOMElement();
    });

    it("should call console.error with the error details", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      renderComponent({ children: <ThrowingComponent /> });

      expect(consoleSpy).toHaveBeenCalledWith(
        "[MFE Runtime Error]",
        expect.any(Error),
        expect.objectContaining({ componentStack: expect.any(String) })
      );
    });

    it("should call onError with the error when provided", () => {
      jest.spyOn(console, "error").mockImplementation();
      const mockOnError = jest.fn();

      renderComponent({ children: <ThrowingComponent />, onError: mockOnError });

      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should not throw when onError is not provided", () => {
      jest.spyOn(console, "error").mockImplementation();

      expect(() => {
        renderComponent({ children: <ThrowingComponent />, onError: undefined });
      }).not.toThrow();
    });
  });
});
