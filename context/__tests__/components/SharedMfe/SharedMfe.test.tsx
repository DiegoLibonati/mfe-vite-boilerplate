import { lazy } from "react";
import { render, screen } from "@testing-library/react";

import type { JSX } from "react";
import type { RenderResult } from "@testing-library/react";

import SharedMfe from "@context/components/SharedMfe/SharedMfe";

interface DummyProps {
  id: string;
  label?: string;
  className?: string;
}

interface RenderOptions {
  component?: React.ComponentType<DummyProps>;
  componentProps?: DummyProps;
  wrapperClass?: string;
  loadingClass?: string;
}

const Dummy = ({ label = "dummy" }: DummyProps): JSX.Element => (
  <span data-testid="dummy">{label}</span>
);

const renderComponent = (options: RenderOptions = {}): RenderResult => {
  const { component = Dummy, componentProps = { id: "a" }, ...rest } = options;

  return render(<SharedMfe component={component} componentProps={componentProps} {...rest} />);
};

const hostOf = (result: RenderResult): HTMLDivElement | null =>
  result.container.querySelector<HTMLDivElement>("[data-mfe='shared']");

describe("SharedMfe", () => {
  describe("rendering", () => {
    it("should render the provided component with its props", () => {
      renderComponent({ componentProps: { id: "a", label: "hello" } });

      expect(screen.getByTestId("dummy")).toHaveTextContent("hello");
    });

    it('should wrap the component in a host div marked data-mfe="shared"', () => {
      const result = renderComponent();

      expect(hostOf(result)).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("should show a skeleton fallback while a lazy component is pending", () => {
      const Never = lazy(
        () =>
          new Promise<{ default: React.ComponentType<DummyProps> }>(() => {
            // Never resolves: keeps the component suspended in its loading state.
          })
      );

      const result = renderComponent({ component: Never });

      expect(
        result.container.querySelector<HTMLDivElement>(".skeleton-shimmer")
      ).toBeInTheDocument();
    });

    it("should forward loadingClass to the skeleton fallback", () => {
      const Never = lazy(
        () =>
          new Promise<{ default: React.ComponentType<DummyProps> }>(() => {
            // Never resolves: keeps the component suspended in its loading state.
          })
      );

      const result = renderComponent({ component: Never, loadingClass: "demo-loader" });

      expect(result.container.querySelector<HTMLDivElement>(".skeleton-shimmer")).toHaveClass(
        "demo-loader"
      );
    });
  });

  describe("error handling", () => {
    it("should render nothing when the component throws (caught by the error boundary)", () => {
      jest.spyOn(console, "error").mockImplementation();
      const Boom = (): never => {
        throw new Error("boom");
      };

      const result = renderComponent({ component: Boom });
      const host = hostOf(result);

      expect(host).toBeInTheDocument();
      expect(host).toBeEmptyDOMElement();
    });
  });

  describe("wrapper class", () => {
    it("should infer a <className>-wrapper class on the host div", () => {
      const result = renderComponent({ componentProps: { id: "a", className: "foo" } });

      expect(hostOf(result)).toHaveClass("foo-wrapper");
    });

    it("should let wrapperClass override the inferred name", () => {
      const result = renderComponent({
        componentProps: { id: "a", className: "foo" },
        wrapperClass: "bar",
      });

      const host = hostOf(result);

      expect(host).toHaveClass("bar");
      expect(host).not.toHaveClass("foo-wrapper");
    });

    it("should add no wrapper class when componentProps has no className", () => {
      const result = renderComponent();

      expect(hostOf(result)?.className).toBe("");
    });
  });
});
