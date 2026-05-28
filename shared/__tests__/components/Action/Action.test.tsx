import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";
import type { ActionProps } from "@mfe/shared/types/props";

import Action from "@mfe/shared/components/Action/Action";

const mockOnClick = jest.fn();

const renderComponent = (props: Partial<ActionProps> = {}): RenderResult => {
  const defaultProps: ActionProps = {
    id: "test-action",
    ariaLabel: "test action",
    children: "Click me",
    onClick: mockOnClick,
    ...props,
  };
  return render(<Action {...defaultProps} />);
};

describe("Action", () => {
  describe("rendering", () => {
    it("should render the button with the provided children", () => {
      renderComponent({ children: "Submit" });

      expect(screen.getByRole("button", { name: "test action" })).toHaveTextContent("Submit");
    });

    it("should render with the base action class", () => {
      renderComponent();

      expect(screen.getByRole("button")).toHaveClass("action");
    });

    it("should append the provided className to the base class", () => {
      renderComponent({ className: "primary" });
      const button = screen.getByRole("button");

      expect(button).toHaveClass("action");
      expect(button).toHaveClass("primary");
    });

    it("should not add extra classes when className is not provided", () => {
      renderComponent({ className: undefined! });

      expect(screen.getByRole("button")).toHaveAttribute("class", "action");
    });

    it("should render with the provided id", () => {
      renderComponent({ id: "my-button" });

      expect(screen.getByRole("button")).toHaveAttribute("id", "my-button");
    });

    it("should render with the provided aria-label", () => {
      renderComponent({ ariaLabel: "close dialog" });

      expect(screen.getByRole("button", { name: "close dialog" })).toBeInTheDocument();
    });

    it("should render as a button of type button", () => {
      renderComponent();

      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });
  });

  describe("behavior", () => {
    it("should call onClick when clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole("button"));

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });
});
