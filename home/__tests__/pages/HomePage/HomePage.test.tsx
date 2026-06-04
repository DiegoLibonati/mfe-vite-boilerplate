import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import HomePage from "@home/pages/HomePage/HomePage";

const renderPage = (): RenderResult => render(<HomePage />);

// The page lazy-loads its shared SDK components (Link/Action) via dynamic import.
// Awaiting one of them lets the import resolve inside act(), so the suspended tree
// does not settle after the test ends (which would log an act(...) warning).
const flushSharedSdk = (): Promise<HTMLElement> =>
  screen.findByRole("link", { name: "Go to About Page" });

describe("HomePage", () => {
  describe("rendering", () => {
    it("should render the page heading", async () => {
      renderPage();

      expect(screen.getByRole("heading", { name: "Home Page", level: 1 })).toBeInTheDocument();

      await flushSharedSdk();
    });

    it("should render the page navigation", async () => {
      renderPage();

      expect(screen.getByRole("navigation", { name: "Page navigation" })).toBeInTheDocument();

      await flushSharedSdk();
    });

    it("should render three navigation list items", async () => {
      renderPage();

      expect(screen.getAllByRole("listitem")).toHaveLength(3);

      await flushSharedSdk();
    });

    it("should render the error boundary demo section", async () => {
      renderPage();

      expect(screen.getByRole("region", { name: "Error boundary demo" })).toBeInTheDocument();

      await flushSharedSdk();
    });
  });

  describe("shared components", () => {
    it("should render the About link once the shared SDK loads", async () => {
      renderPage();

      expect(await screen.findByRole("link", { name: "Go to About Page" })).toHaveAttribute(
        "href",
        "/about"
      );
    });

    it("should render the Users link once the shared SDK loads", async () => {
      renderPage();

      expect(await screen.findByRole("link", { name: "Go to Users Page" })).toHaveAttribute(
        "href",
        "/users"
      );
    });

    it("should render the error-trigger action once the shared SDK loads", async () => {
      renderPage();

      expect(
        await screen.findByRole("button", { name: "Trigger error boundary" })
      ).toBeInTheDocument();
    });
  });
});
