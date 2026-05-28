import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";
import type { SharedComponentModule } from "@mfe/shared/types/mfe";

import ProductPage from "@/pages/ProductPage/ProductPage";

let mockLinkMount: jest.Mock;
let mockActionMount: jest.Mock;

jest.mock("@mfe/shared", () => {
  const actual: Record<string, unknown> = jest.requireActual("@mfe/shared");
  return {
    ...actual,
    LinkModule: { mount: jest.fn(), unmount: jest.fn() },
    ActionModule: { mount: jest.fn(), unmount: jest.fn() },
  };
});

const renderPage = (productId = "1"): RenderResult => render(<ProductPage productId={productId} />);

beforeAll(async () => {
  const { LinkModule, ActionModule } = await import("@mfe/shared");
  mockLinkMount = (LinkModule as unknown as SharedComponentModule).mount as jest.Mock;
  mockActionMount = (ActionModule as unknown as SharedComponentModule).mount as jest.Mock;
});

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

  describe("behavior", () => {
    it("should mount the link module once", () => {
      renderPage();

      expect(mockLinkMount).toHaveBeenCalledTimes(1);
    });

    it("should mount the action module once", () => {
      renderPage();

      expect(mockActionMount).toHaveBeenCalledTimes(1);
    });

    it("should pass not-found link props to a shared-mfe component", () => {
      renderPage();

      expect(mockLinkMount).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        {
          id: "product-link-not-found",
          ariaLabel: "Go to an unknown page",
          href: "/pasdasdasdasd",
          target: "_self",
          children: "Go to Not Exists Page",
        },
        undefined
      );
    });

    it("should pass action props with the product id to a shared-mfe component", () => {
      renderPage("7");

      expect(mockActionMount).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        expect.objectContaining({
          id: "action-show-product-id",
          ariaLabel: "Show product ID 7",
          children: "Click Product Id",
        }),
        undefined
      );
    });

    it("should pass an onClick callback that calls alert with the product id", () => {
      jest.spyOn(window, "alert").mockImplementation();
      renderPage("99");
      const onClick = mockActionMount.mock.calls[0][1].onClick as () => void;

      onClick();

      expect(window.alert).toHaveBeenCalledWith("Product ID: 99");
    });
  });
});
