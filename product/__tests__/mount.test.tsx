import { StrictMode } from "react";

import type { ReactElement } from "react";

import App from "@product/App";

import { mount, unmount } from "@product/Product.module";

let mockRender: jest.Mock;
let mockUnmount: jest.Mock;
let mockCreateRoot: jest.Mock;

jest.mock("react-dom/client", () => {
  const actual: Record<string, unknown> = jest.requireActual("react-dom/client");
  return {
    ...actual,
    createRoot: jest.fn(),
  };
});

beforeEach(async () => {
  mockRender = jest.fn();
  mockUnmount = jest.fn();

  const { createRoot } = await import("react-dom/client");
  mockCreateRoot = createRoot as jest.Mock;
  mockCreateRoot.mockReturnValue({ render: mockRender, unmount: mockUnmount });
});

describe("mount", () => {
  describe("mount", () => {
    it("should call createRoot with the provided container", () => {
      const container = document.createElement("div");
      const options = { productId: "1", callbacks: { onNavigate: jest.fn() } };

      mount(container, options);

      expect(mockCreateRoot).toHaveBeenCalledWith(container);
    });

    it("should render App wrapped in StrictMode and InheritedProvider", () => {
      const container = document.createElement("div");
      const mockOnNavigate = jest.fn();
      const options = { productId: "5", callbacks: { onNavigate: mockOnNavigate } };

      mount(container, options);

      const rendered = mockRender.mock.calls[0][0] as ReactElement;
      expect(rendered.type).toBe(StrictMode);

      const inherited = (rendered.props as { children: ReactElement }).children;
      expect(inherited.props).toEqual(
        expect.objectContaining({ callbacks: { onNavigate: mockOnNavigate } })
      );

      const app = (inherited.props as { children: ReactElement }).children;
      expect(app.type).toBe(App);
      expect(app.props).toEqual({ productId: "5" });
    });

    it("should unmount the previous root when mounting on the same container", async () => {
      const container = document.createElement("div");
      const options = { productId: "1", callbacks: { onNavigate: jest.fn() } };

      mount(container, options);
      mount(container, options);
      await new Promise<void>((resolve) => {
        queueMicrotask(resolve);
      });

      expect(mockUnmount).toHaveBeenCalledTimes(1);
    });

    it("should not unmount when mounting on different containers", () => {
      const container1 = document.createElement("div");
      const container2 = document.createElement("div");
      const options = { productId: "1", callbacks: { onNavigate: jest.fn() } };

      mount(container1, options);
      mount(container2, options);

      expect(mockUnmount).not.toHaveBeenCalled();
    });
  });

  describe("unmount", () => {
    it("should call root.unmount via queueMicrotask for a mounted container", async () => {
      const container = document.createElement("div");
      const options = { productId: "1", callbacks: { onNavigate: jest.fn() } };
      mount(container, options);
      mockUnmount.mockClear();

      unmount(container);
      await new Promise<void>((resolve) => {
        queueMicrotask(resolve);
      });

      expect(mockUnmount).toHaveBeenCalledTimes(1);
    });

    it("should not call root.unmount for a container that was never mounted", async () => {
      const container = document.createElement("div");

      unmount(container);
      await new Promise<void>((resolve) => {
        queueMicrotask(resolve);
      });

      expect(mockUnmount).not.toHaveBeenCalled();
    });
  });
});
