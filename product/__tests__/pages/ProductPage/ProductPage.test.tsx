import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";

import ProductPage from "@product/pages/ProductPage/ProductPage";

const renderPage = (productId = "1"): RenderResult => render(<ProductPage productId={productId} />);

// The page lazy-loads its shared SDK components (Link/Action) via dynamic import.
// Awaiting one of them lets the import resolve inside act(), so the suspended tree
// does not settle after the test ends (which would log an act(...) warning).
const flushSharedSdk = (): Promise<HTMLElement> =>
  screen.findByRole("link", { name: "Go to an unknown page" });

describe("ProductPage", () => {
  describe("rendering", () => {
    it("should render the page heading with the product id", async () => {
      renderPage("42");

      expect(
        screen.getByRole("heading", { name: "Product Page: 42", level: 1 })
      ).toBeInTheDocument();

      await flushSharedSdk();
    });

    it("should render the page navigation", async () => {
      renderPage();

      expect(screen.getByRole("navigation", { name: "Page navigation" })).toBeInTheDocument();

      await flushSharedSdk();
    });

    it("should render one navigation list item", async () => {
      renderPage();

      expect(screen.getByRole("listitem")).toBeInTheDocument();

      await flushSharedSdk();
    });

    it("should render the product actions section", async () => {
      renderPage();

      expect(screen.getByRole("region", { name: "Product actions" })).toBeInTheDocument();

      await flushSharedSdk();
    });
  });

  describe("shared components", () => {
    it("should render the not-found link once the shared SDK loads", async () => {
      renderPage();

      expect(await screen.findByRole("link", { name: "Go to an unknown page" })).toHaveAttribute(
        "href",
        "/pasdasdasdasd"
      );
    });

    it("should render the action button with the product id once the shared SDK loads", async () => {
      renderPage("7");

      expect(await screen.findByRole("button", { name: "Show product ID 7" })).toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    it("should alert the product id when the action is clicked", async () => {
      jest.spyOn(window, "alert").mockImplementation();
      const user = userEvent.setup();
      renderPage("99");

      await user.click(await screen.findByRole("button", { name: "Show product ID 99" }));

      expect(window.alert).toHaveBeenCalledWith("Product ID: 99");
    });
  });
});
