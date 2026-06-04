import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InheritedProvider } from "shared/sdk";

import type { JSX } from "react";
import type { RenderResult } from "@testing-library/react";
import type { MfeCallbacks } from "shared/sdk";

import ContextPage from "@context/pages/ContextPage/ContextPage";

import { CounterProvider } from "@context/contexts/CounterContext/CounterProvider";

const renderPage = (
  ui: JSX.Element = (
    <CounterProvider>
      <ContextPage />
    </CounterProvider>
  )
): RenderResult => render(ui);

const clickAction = (name: string): Promise<void> =>
  userEvent.setup().click(screen.getByRole("button", { name }));

const findActionName = async (name: string): Promise<string> => {
  await screen.findByRole("button", { name });
  return name;
};

// The page lazy-loads its shared SDK components (Action/Link) via dynamic import.
// Awaiting one of them lets the import resolve inside act(), so the suspended tree
// does not settle after the test ends (which would log an act(...) warning).
const flushSharedSdk = (): Promise<HTMLElement> =>
  screen.findByRole("link", { name: "Go to unknown page" });

describe("ContextPage", () => {
  describe("rendering", () => {
    it("should render the page title", async () => {
      renderPage();

      expect(screen.getByRole("heading", { name: "Context Page" })).toBeInTheDocument();

      await flushSharedSdk();
    });

    it("should render the counter section", async () => {
      renderPage();

      expect(screen.getByRole("region", { name: "Counter" })).toBeInTheDocument();

      await flushSharedSdk();
    });

    it("should render the counter output with initial value 0", async () => {
      renderPage();

      expect(screen.getByRole("status", { name: /Counter value/ })).toHaveTextContent("0");

      await flushSharedSdk();
    });

    it("should render the navigation section", async () => {
      renderPage();

      expect(screen.getByRole("navigation", { name: "Page navigation" })).toBeInTheDocument();

      await flushSharedSdk();
    });
  });

  describe("shared components", () => {
    it("should render the subtract and add actions once the shared SDK loads", async () => {
      renderPage();

      expect(
        await screen.findByRole("button", { name: "Subtract 1 from counter" })
      ).toBeInTheDocument();
      expect(await screen.findByRole("button", { name: "Add 1 to counter" })).toBeInTheDocument();
    });

    it("should render the not-exists link once the shared SDK loads", async () => {
      renderPage();

      expect(await screen.findByRole("link", { name: "Go to unknown page" })).toHaveAttribute(
        "href",
        "/pasdasdasdasd"
      );
    });
  });

  describe("behavior", () => {
    it("should increment the counter when the add action is clicked", async () => {
      renderPage();

      await clickAction(await findActionName("Add 1 to counter"));

      expect(screen.getByRole("status")).toHaveTextContent("1");
    });

    it("should decrement back to zero when add then subtract are clicked", async () => {
      renderPage();

      await clickAction(await findActionName("Add 1 to counter"));
      await clickAction("Subtract 1 from counter");

      expect(screen.getByRole("status")).toHaveTextContent("0");
    });

    it("should reflect multiple increments correctly", async () => {
      renderPage();

      const name = await findActionName("Add 1 to counter");
      await clickAction(name);
      await clickAction(name);
      await clickAction(name);

      expect(screen.getByRole("status")).toHaveTextContent("3");
    });

    it("should allow the counter to go below zero", async () => {
      renderPage();

      await clickAction(await findActionName("Subtract 1 from counter"));

      expect(screen.getByRole("status")).toHaveTextContent("-1");
    });
  });

  describe("accessibility", () => {
    it("should update the counter output aria-label when the counter changes", async () => {
      renderPage();

      await clickAction(await findActionName("Add 1 to counter"));

      expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Counter value: 1");
    });
  });

  describe("integration with InheritedContext", () => {
    it("should emit a counterChange event via onEvent when the counter changes", async () => {
      const mockOnEvent = jest.fn();
      const mockCallbacks: MfeCallbacks = {
        onNavigate: jest.fn(),
        onEvent: mockOnEvent,
      };

      renderPage(
        <InheritedProvider callbacks={mockCallbacks}>
          <CounterProvider>
            <ContextPage />
          </CounterProvider>
        </InheritedProvider>
      );

      await clickAction(await findActionName("Add 1 to counter"));

      expect(mockOnEvent).toHaveBeenCalledWith({
        type: "counterChange",
        payload: { counter: 1 },
      });
    });
  });
});
