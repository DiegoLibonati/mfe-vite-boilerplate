import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { JSX } from "react";
import type { RenderResult } from "@testing-library/react";

import ErrorBoundary from "@container/components/ErrorBoundary/ErrorBoundary";

let shouldThrow = false;

const ChildComponent = (): JSX.Element => {
  if (shouldThrow) throw new Error("Test error");
  return <div>Child content</div>;
};

const renderComponent = (): RenderResult =>
  render(
    <ErrorBoundary>
      <ChildComponent />
    </ErrorBoundary>
  );

describe("ErrorBoundary", () => {
  beforeEach(() => {
    shouldThrow = false;
  });

  describe("rendering", () => {
    it("should render children when there is no error", () => {
      renderComponent();

      expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("should render the error title when a child throws", () => {
      shouldThrow = true;
      jest.spyOn(console, "error").mockImplementation();

      renderComponent();

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("should display the error message", () => {
      shouldThrow = true;
      jest.spyOn(console, "error").mockImplementation();

      renderComponent();

      expect(screen.getByText("Test error")).toBeInTheDocument();
    });

    it("should render the retry button", () => {
      shouldThrow = true;
      jest.spyOn(console, "error").mockImplementation();

      renderComponent();

      expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    it("should recover when try again is clicked and the child no longer throws", async () => {
      shouldThrow = true;
      jest.spyOn(console, "error").mockImplementation();
      const user = userEvent.setup();

      renderComponent();

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      shouldThrow = false;
      await user.click(screen.getByRole("button", { name: "Try again" }));

      expect(screen.getByText("Child content")).toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("should log the caught error to console", () => {
      shouldThrow = true;
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      renderComponent();

      expect(consoleSpy).toHaveBeenCalledWith(
        "ErrorBoundary caught an error:",
        expect.any(Error),
        expect.anything()
      );
    });
  });
});
