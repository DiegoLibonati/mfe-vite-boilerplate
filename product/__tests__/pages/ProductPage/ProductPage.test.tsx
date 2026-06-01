import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";

import ProductPage from "@product/pages/ProductPage/ProductPage";

const renderPage = (productId = "1"): RenderResult => render(<ProductPage productId={productId} />);

describe("ProductPage", () => {
  describe("rendering", () => {
    it("should render the page heading with the product id", () => {
      renderPage("42");

      expect(
        screen.getByRole("heading", { name: "Product Page: 42", level: 1 })
      ).toBeInTheDocument();
    });

    it("should render the page navigation", () => {
      renderPage();

      expect(screen.getByRole("navigation", { name: "Page navigation" })).toBeInTheDocument();
    });

    it("should render one navigation list item", () => {
      renderPage();

      expect(screen.getByRole("listitem")).toBeInTheDocument();
    });

    it("should render the product actions section", () => {
      renderPage();

      expect(screen.getByRole("region", { name: "Product actions" })).toBeInTheDocument();
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
