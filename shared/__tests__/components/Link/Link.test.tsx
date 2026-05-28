import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";
import type { LinkProps } from "@mfe/shared/types/props";

import Link from "@mfe/shared/components/Link/Link";

import { InheritedProvider } from "@mfe/shared/contexts/InheritedContext/InheritedProvider";

import { mockCallbacks } from "@tests/__mocks__/callbacks.mock";

const renderComponent = (
  props: Partial<LinkProps> = {},
  options: { embedded?: boolean } = {}
): RenderResult => {
  const defaultProps: LinkProps = {
    id: "test-link",
    href: "https://example.com",
    ariaLabel: "test link",
    children: "Click me",
    ...props,
  };

  if (options.embedded) {
    return render(
      <InheritedProvider callbacks={mockCallbacks}>
        <Link {...defaultProps} />
      </InheritedProvider>
    );
  }

  return render(<Link {...defaultProps} />);
};

describe("Link", () => {
  describe("rendering", () => {
    it("should render the link with the provided children", () => {
      renderComponent({ children: "Go home" });

      expect(screen.getByRole("link", { name: "test link" })).toHaveTextContent("Go home");
    });

    it("should render with the provided href", () => {
      renderComponent({ href: "/about" });

      expect(screen.getByRole("link")).toHaveAttribute("href", "/about");
    });

    it("should render with the provided id", () => {
      renderComponent({ id: "nav-link" });

      expect(screen.getByRole("link")).toHaveAttribute("id", "nav-link");
    });

    it("should render with the provided aria-label", () => {
      renderComponent({ ariaLabel: "navigate to about" });

      expect(screen.getByRole("link", { name: "navigate to about" })).toBeInTheDocument();
    });

    it("should render with the base link class", () => {
      renderComponent();

      expect(screen.getByRole("link")).toHaveClass("link");
    });

    it("should append the provided className to the base class", () => {
      renderComponent({ className: "active" });
      const link = screen.getByRole("link");

      expect(link).toHaveClass("link");
      expect(link).toHaveClass("active");
    });

    it("should not add extra classes when className is not provided", () => {
      renderComponent({ className: undefined! });

      expect(screen.getByRole("link")).toHaveAttribute("class", "link");
    });

    it("should default target to _blank", () => {
      renderComponent();

      expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
    });

    it("should render with the provided target", () => {
      renderComponent({ target: "_self" });

      expect(screen.getByRole("link")).toHaveAttribute("target", "_self");
    });
  });

  describe("external link", () => {
    it("should have rel noopener noreferrer when target is _blank", () => {
      renderComponent({ target: "_blank" });

      expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should not have rel when target is not _blank", () => {
      renderComponent({ target: "_self" });

      expect(screen.getByRole("link")).not.toHaveAttribute("rel");
    });
  });

  describe("behavior", () => {
    describe("when standalone (no context)", () => {
      it("should not throw when clicking a non-external link", async () => {
        const user = userEvent.setup();
        renderComponent({ target: "_self", href: "/about" });

        await user.click(screen.getByRole("link"));

        expect(screen.getByRole("link")).toBeInTheDocument();
      });
    });

    describe("when embedded (with InheritedProvider)", () => {
      it("should not call onNavigate when clicking an external link", async () => {
        const user = userEvent.setup();
        renderComponent({ target: "_blank", href: "https://example.com" }, { embedded: true });

        await user.click(screen.getByRole("link"));

        expect(mockCallbacks.onNavigate).not.toHaveBeenCalled();
      });

      it("should call onNavigate with the href when clicking a non-external link", async () => {
        const user = userEvent.setup();
        renderComponent({ target: "_self", href: "/about" }, { embedded: true });

        await user.click(screen.getByRole("link"));

        expect(mockCallbacks.onNavigate).toHaveBeenCalledTimes(1);
        expect(mockCallbacks.onNavigate).toHaveBeenCalledWith("/about");
      });
    });
  });
});
