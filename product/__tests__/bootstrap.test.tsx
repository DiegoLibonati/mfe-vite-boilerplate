import { StrictMode } from "react";

import type { ReactElement } from "react";

import App from "@product/App";

let createRootElement: unknown;
let renderCallCount: number;
let renderedElement: ReactElement;

jest.mock("react-dom/client", () => {
  const actual: Record<string, unknown> = jest.requireActual("react-dom/client");
  return {
    ...actual,
    createRoot: jest.fn(() => ({
      render: jest.fn(),
    })),
  };
});

describe("bootstrap", () => {
  beforeAll(async () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);

    await import("@product/bootstrap");

    const { createRoot } = await import("react-dom/client");
    const mockCreateRoot = createRoot as jest.Mock;
    createRootElement = mockCreateRoot.mock.calls[0]?.[0];

    const mockRoot = mockCreateRoot.mock.results[0]?.value as {
      render: jest.Mock;
    };
    renderCallCount = mockRoot.render.mock.calls.length;
    renderedElement = mockRoot.render.mock.calls[0]?.[0] as ReactElement;
  });

  afterAll(() => {
    document.body.innerHTML = "";
  });

  it("should call createRoot with the root element", () => {
    expect(createRootElement).toBe(document.querySelector<HTMLDivElement>("#root"));
  });

  it("should render the application once", () => {
    expect(renderCallCount).toBe(1);
  });

  it("should render App inside StrictMode", () => {
    expect(renderedElement.type).toBe(StrictMode);
  });

  it("should include the App component in the render tree", () => {
    const child = (renderedElement.props as { children: ReactElement }).children;

    expect(child.type).toBe(App);
  });

  it("should pass productId 1 to the App component", () => {
    const child = (renderedElement.props as { children: ReactElement }).children;

    expect(child.props).toEqual({ productId: "1" });
  });
});
