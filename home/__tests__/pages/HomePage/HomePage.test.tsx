import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import HomePage from "@home/pages/HomePage/HomePage";

const renderPage = (): RenderResult => render(<HomePage />);

describe("HomePage", () => {
  describe("rendering", () => {
    it("should render the page heading", () => {
      renderPage();

      expect(screen.getByRole("heading", { name: "Home Page", level: 1 })).toBeInTheDocument();
    });

    it("should render the page navigation", () => {
      renderPage();

      expect(screen.getByRole("navigation", { name: "Page navigation" })).toBeInTheDocument();
    });

    it("should render three navigation list items", () => {
      renderPage();

      expect(screen.getAllByRole("listitem")).toHaveLength(3);
    });

    it("should render the error boundary demo section", () => {
      renderPage();

      expect(screen.getByRole("region", { name: "Error boundary demo" })).toBeInTheDocument();
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
