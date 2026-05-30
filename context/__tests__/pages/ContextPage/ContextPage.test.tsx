import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InheritedProvider } from "shared/sdk";

import type { RenderResult } from "@testing-library/react";
import type { MfeCallbacks } from "shared/sdk";

import ContextPage from "@context/pages/ContextPage/ContextPage";

import { CounterProvider } from "@context/contexts/CounterContext/CounterProvider";

const renderPage = (): RenderResult =>
  render(
    <CounterProvider>
      <ContextPage />
    </CounterProvider>
  );

describe("ContextPage", () => {
  describe("rendering", () => {
    it("should render the page title", () => {
      renderPage();

      expect(screen.getByRole("heading", { name: "Context Page" })).toBeInTheDocument();
    });

    it("should render the counter section", () => {
      renderPage();

      expect(screen.getByRole("region", { name: "Counter" })).toBeInTheDocument();
    });

    it("should render the counter output with initial value 0", () => {
      renderPage();

      const output = screen.getByRole("status", { name: /Counter value/ });

      expect(output).toHaveTextContent("0");
    });

    it("should render the subtract button", async () => {
      renderPage();

      expect(
        await screen.findByRole("button", { name: "Subtract 1 from counter" })
      ).toBeInTheDocument();
    });

    it("should render the add button", async () => {
      renderPage();

      expect(await screen.findByRole("button", { name: "Add 1 to counter" })).toBeInTheDocument();
    });

    it("should render the navigation section", () => {
      renderPage();

      expect(screen.getByRole("navigation", { name: "Page navigation" })).toBeInTheDocument();
    });

    it("should render the navigation link", async () => {
      renderPage();

      expect(await screen.findByRole("link", { name: "Go to unknown page" })).toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    it("should increment the counter when the add button is clicked", async () => {
      const user = userEvent.setup();
      renderPage();

      const addButton = await screen.findByRole("button", {
        name: "Add 1 to counter",
      });
      await user.click(addButton);

      expect(screen.getByRole("status")).toHaveTextContent("1");
    });

    it("should decrement the counter when the subtract button is clicked", async () => {
      const user = userEvent.setup();
      renderPage();

      const addButton = await screen.findByRole("button", {
        name: "Add 1 to counter",
      });
      await user.click(addButton);

      const subtractButton = screen.getByRole("button", {
        name: "Subtract 1 from counter",
      });
      await user.click(subtractButton);

      expect(screen.getByRole("status")).toHaveTextContent("0");
    });

    it("should reflect multiple increments correctly", async () => {
      const user = userEvent.setup();
      renderPage();

      const addButton = await screen.findByRole("button", {
        name: "Add 1 to counter",
      });
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);

      expect(screen.getByRole("status")).toHaveTextContent("3");
    });

    it("should allow the counter to go below zero", async () => {
      const user = userEvent.setup();
      renderPage();

      const subtractButton = await screen.findByRole("button", {
        name: "Subtract 1 from counter",
      });
      await user.click(subtractButton);

      expect(screen.getByRole("status")).toHaveTextContent("-1");
    });
  });

  describe("accessibility", () => {
    it("should update the counter output aria-label when the counter changes", async () => {
      const user = userEvent.setup();
      renderPage();

      expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Counter value: 0");

      const addButton = await screen.findByRole("button", {
        name: "Add 1 to counter",
      });
      await user.click(addButton);

      expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Counter value: 1");
    });
  });

  describe("integration with InheritedContext", () => {
    it("should emit counterChange event via onEvent when the counter changes", async () => {
      const mockOnEvent = jest.fn();
      const mockCallbacks: MfeCallbacks = {
        onNavigate: jest.fn(),
        onEvent: mockOnEvent,
      };
      const user = userEvent.setup();

      render(
        <InheritedProvider callbacks={mockCallbacks}>
          <CounterProvider>
            <ContextPage />
          </CounterProvider>
        </InheritedProvider>
      );

      const addButton = await screen.findByRole("button", {
        name: "Add 1 to counter",
      });
      await user.click(addButton);

      expect(mockOnEvent).toHaveBeenCalledWith({
        type: "counterChange",
        payload: { counter: 1 },
      });
    });
  });
});
