import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import NotFoundPage from "@not-found/pages/NotFoundPage/NotFoundPage";

const renderPage = (): RenderResult => render(<NotFoundPage />);

describe("NotFoundPage", () => {
  describe("rendering", () => {
    it("should render the page heading", () => {
      renderPage();

      expect(screen.getByRole("heading", { name: "Page Not Found", level: 1 })).toBeInTheDocument();
    });

    it("should render the description text", () => {
      renderPage();

      expect(
        screen.getByText("The page you're looking for doesn't exist or has been moved.")
      ).toBeInTheDocument();
    });

    it("should render the main landmark", () => {
      renderPage();

      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should render the main element with the not-found-page class", () => {
      renderPage();

      expect(screen.getByRole("main")).toHaveClass("not-found-page");
    });
  });
});
