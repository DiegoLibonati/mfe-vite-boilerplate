import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import App from "@home/App";

jest.mock("shared/sdk", () => {
  const actual: Record<string, unknown> = jest.requireActual("shared/sdk");
  return {
    ...actual,
    LinkModule: { mount: jest.fn(), unmount: jest.fn() },
    ActionModule: { mount: jest.fn(), unmount: jest.fn() },
  };
});

const renderApp = (): RenderResult => render(<App />);

describe("App", () => {
  it("should render the HomePage", () => {
    renderApp();

    expect(screen.getByRole("heading", { name: "Home Page" })).toBeInTheDocument();
  });
});
