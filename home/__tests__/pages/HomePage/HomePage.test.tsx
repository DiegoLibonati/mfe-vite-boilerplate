import { act, render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";
import type { SharedComponentModule } from "shared/sdk";

import HomePage from "@home/pages/HomePage/HomePage";

let mockLinkMount: jest.Mock;
let mockActionMount: jest.Mock;

jest.mock("shared/sdk", () => {
  const actual: Record<string, unknown> = jest.requireActual("shared/sdk");
  return {
    ...actual,
    LinkModule: { mount: jest.fn(), unmount: jest.fn() },
    ActionModule: { mount: jest.fn(), unmount: jest.fn() },
  };
});

const renderPage = (): RenderResult => render(<HomePage />);

beforeAll(async () => {
  const { LinkModule, ActionModule } = await import("shared/sdk");
  mockLinkMount = (LinkModule as unknown as SharedComponentModule).mount as jest.Mock;
  mockActionMount = (ActionModule as unknown as SharedComponentModule).mount as jest.Mock;
});

describe("HomePage", () => {
  describe("rendering", () => {
    it("should render the page heading", () => {
      renderPage();

      expect(screen.getByRole("heading", { name: "Home Page", level: 1 })).toBeInTheDocument();
    });

    it("should render the page navigation", () => {
      renderPage();

      expect(screen.getByRole("navigation", { name: "Page navigation" })).toBeInTheDocument();
    });

    it("should render three navigation list items", () => {
      renderPage();

      expect(screen.getAllByRole("listitem")).toHaveLength(3);
    });

    it("should render the error boundary demo section", () => {
      renderPage();

      expect(screen.getByRole("region", { name: "Error boundary demo" })).toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    it("should mount the link module three times", () => {
      renderPage();

      expect(mockLinkMount).toHaveBeenCalledTimes(3);
    });

    it("should mount the action module once", () => {
      renderPage();

      expect(mockActionMount).toHaveBeenCalledTimes(1);
    });

    it("should pass about link props to a shared-mfe component", () => {
      renderPage();

      expect(mockLinkMount).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        {
          id: "link-about",
          ariaLabel: "Go to About Page",
          href: "/about",
          target: "_self",
          children: "Go to About Page",
        },
        undefined
      );
    });

    it("should pass about-new-window link props to a shared-mfe component", () => {
      renderPage();

      expect(mockLinkMount).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        {
          id: "link-about-new-window",
          ariaLabel: "Go to About Page in a new window",
          href: "/about",
          children: "Go to About Page in Another Window",
        },
        undefined
      );
    });

    it("should pass users link props to a shared-mfe component", () => {
      renderPage();

      expect(mockLinkMount).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        {
          id: "link-users",
          ariaLabel: "Go to Users Page",
          href: "/users",
          target: "_self",
          children: "Go to Users Page",
        },
        undefined
      );
    });

    it("should pass error trigger action props to a shared-mfe component", () => {
      renderPage();

      expect(mockActionMount).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        expect.objectContaining({
          id: "action-trigger-error",
          ariaLabel: "Trigger error boundary",
          className: "home-page__demo-action",
          children: "Trigger Error Boundary",
        }),
        undefined
      );
    });
  });

  describe("error handling", () => {
    it("should throw when the error trigger onClick callback is invoked", () => {
      jest.spyOn(console, "error").mockImplementation();
      renderPage();
      const onClick = mockActionMount.mock.calls[0][1].onClick as () => void;

      expect(() => {
        act(() => {
          onClick();
        });
      }).toThrow("Error boundary triggered manually.");
    });
  });
});
