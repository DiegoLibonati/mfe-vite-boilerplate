import { act } from "@testing-library/react";

describe("bootstrap", () => {
  it("should render the App into the root element", async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await act(async () => {
      await import("@shared/bootstrap");
    });

    const root = document.querySelector<HTMLDivElement>("#root")!;
    expect(root.querySelector<HTMLElement>("main")).toBeInTheDocument();
    expect(root.querySelector<HTMLHeadingElement>("h1")).toHaveTextContent(
      "Shared — Dev Playground"
    );
  });
});
