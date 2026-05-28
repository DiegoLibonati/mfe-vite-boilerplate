import { act, render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";
import type { ProductAppProps } from "@/types/props";

import ProductApp from "@/components/ProductApp/ProductApp";

import { mockCallbacks } from "@tests/__mocks__/callbacks.mock";

const mockProductMount = jest.fn();
const mockProductUnmount = jest.fn();

jest.mock(
  "product/ProductApp",
  () => ({
    __esModule: true,
    default: {
      mount: mockProductMount,
      unmount: mockProductUnmount,
    },
  }),
  { virtual: true }
);

const renderComponent = async (
  props: Partial<ProductAppProps> = {},
  productId = "123"
): Promise<RenderResult> => {
  let result!: RenderResult;
  await act(async () => {
    result = render(
      <MemoryRouter initialEntries={[`/products/${productId}`]}>
        <Routes>
          <Route
            path="/products/:productId"
            element={<ProductApp callbacks={mockCallbacks} {...props} />}
          />
        </Routes>
      </MemoryRouter>
    );
    await Promise.resolve();
  });
  return result;
};

describe("ProductApp", () => {
  describe("rendering", () => {
    it("should mount the product module after loading", async () => {
      await renderComponent();

      expect(mockProductMount).toHaveBeenCalledTimes(1);
    });
  });

  describe("behavior", () => {
    it("should pass the productId from the URL as mountData", async () => {
      await renderComponent({}, "456");

      expect(mockProductMount).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        expect.objectContaining({
          productId: "456",
        })
      );
    });

    it("should pass callbacks to the module", async () => {
      await renderComponent();

      expect(mockProductMount).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        expect.objectContaining({
          callbacks: mockCallbacks,
        })
      );
    });
  });
});
