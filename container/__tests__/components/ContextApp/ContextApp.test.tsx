import { act, render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";
import type { MfeMountOptions } from "shared/sdk";
import type { ContextAppProps } from "@container/types/props";

import ContextApp from "@container/components/ContextApp/ContextApp";

import { mockCallbacks } from "@tests/__mocks__/callbacks.mock";

const mockContextMount = jest.fn();
const mockContextUnmount = jest.fn();

jest.mock(
  "context/ContextApp",
  () => ({
    __esModule: true,
    default: {
      mount: mockContextMount,
      unmount: mockContextUnmount,
    },
  }),
  { virtual: true }
);

const renderComponent = async (props: Partial<ContextAppProps> = {}): Promise<RenderResult> => {
  let result!: RenderResult;
  await act(async () => {
    const defaultProps: ContextAppProps = {
      callbacks: mockCallbacks,
      ...props,
    };
    result = render(<ContextApp {...defaultProps} />);
    await Promise.resolve();
  });
  return result;
};

describe("ContextApp", () => {
  describe("rendering", () => {
    it("should not show the counter banner initially", async () => {
      await renderComponent();

      expect(mockContextMount).toHaveBeenCalled();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("should mount the context remote module", async () => {
      await renderComponent();

      expect(mockContextMount).toHaveBeenCalledTimes(1);
    });
  });

  describe("behavior", () => {
    it("should show the counter banner when an event is received", async () => {
      mockContextMount.mockImplementation((_container: HTMLElement, options: MfeMountOptions) => {
        options.callbacks.onEvent?.({
          type: "counterChange",
          payload: { counter: 42 },
        });
      });

      await renderComponent();

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
      expect(screen.getByText("Counter value received by host:")).toBeInTheDocument();
    });

    it("should pass the onNavigate callback through to the module", async () => {
      mockContextMount.mockImplementation((_container: HTMLElement, options: MfeMountOptions) => {
        options.callbacks.onNavigate("/test-path");
      });

      await renderComponent();

      expect(mockCallbacks.onNavigate).toHaveBeenCalledWith("/test-path");
    });

    it("should include onEvent in the enhanced callbacks", async () => {
      await renderComponent();

      expect(mockContextMount).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        expect.objectContaining({
          callbacks: expect.objectContaining({
            onNavigate: expect.any(Function),
            onEvent: expect.any(Function),
          }),
        })
      );
    });
  });
});
