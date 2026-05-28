import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import DefaultLoading from "@/components/DefaultLoading/DefaultLoading";

const renderComponent = (): RenderResult => render(<DefaultLoading />);

describe("DefaultLoading", () => {
  describe("rendering", () => {
    it("should render the loading text", () => {
      renderComponent();

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should render with the loading aria-label", () => {
      renderComponent();

      expect(screen.getByLabelText("Loading remote module")).toBeInTheDocument();
    });

    it("should render the spinner element", () => {
      const { container } = renderComponent();

      expect(
        container.querySelector<HTMLDivElement>(".default-loading__spinner")
      ).toBeInTheDocument();
    });
  });
});
