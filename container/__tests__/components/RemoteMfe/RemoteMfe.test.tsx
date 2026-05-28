import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";
import type { MfeMountOptions } from "@mfe/shared/types";
import type { RemoteMfeProps } from "@/types/props";

import RemoteMfe from "@/components/RemoteMfe/RemoteMfe";

import { mockCallbacks } from "@tests/__mocks__/callbacks.mock";
import { mockMfeModule } from "@tests/__mocks__/mfe-module.mock";

const mockLoadModule = jest.fn();

const renderComponent = async (props: Partial<RemoteMfeProps> = {}): Promise<RenderResult> => {
  let result!: RenderResult;
  await act(async () => {
    const defaultProps: RemoteMfeProps = {
      loadModule: mockLoadModule,
      callbacks: mockCallbacks,
      ...props,
    };
    result = render(<RemoteMfe {...defaultProps} />);
    await Promise.resolve();
  });
  return result;
};

describe("RemoteMfe", () => {
  describe("loading state", () => {
    it("should show the default loading fallback while the module is loading", async () => {
      mockLoadModule.mockReturnValue(
        new Promise(() => {
          // Empty fn
        })
      );

      await renderComponent();

      expect(screen.getByLabelText("Loading remote module")).toBeInTheDocument();
    });

    it("should show a custom loading fallback when provided", async () => {
      mockLoadModule.mockReturnValue(
        new Promise(() => {
          // Empty fn
        })
      );

      await renderComponent({ loadingFallback: <div>Custom loading</div> });

      expect(screen.getByText("Custom loading")).toBeInTheDocument();
      expect(screen.queryByLabelText("Loading remote module")).not.toBeInTheDocument();
    });

    it("should hide the container div while loading", async () => {
      mockLoadModule.mockReturnValue(
        new Promise(() => {
          // Empty fn
        })
      );

      await renderComponent();

      const container = document.querySelector<HTMLDivElement>(".remote-mfe__container");
      expect(container).toHaveClass("remote-mfe__container--hidden");
    });
  });

  describe("mounted state", () => {
    it("should hide loading after the module loads successfully", async () => {
      mockLoadModule.mockResolvedValue({ default: mockMfeModule });

      await renderComponent();

      expect(screen.queryByLabelText("Loading remote module")).not.toBeInTheDocument();
    });

    it("should call mount on the loaded module", async () => {
      mockLoadModule.mockResolvedValue({ default: mockMfeModule });

      await renderComponent();

      expect(mockMfeModule.mount).toHaveBeenCalledTimes(1);
      expect(mockMfeModule.mount).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        expect.objectContaining({
          callbacks: mockCallbacks,
          onError: expect.any(Function),
        })
      );
    });

    it("should handle modules without a default export", async () => {
      mockLoadModule.mockResolvedValue(mockMfeModule);

      await renderComponent();

      expect(mockMfeModule.mount).toHaveBeenCalledTimes(1);
    });

    it("should pass mountData to the module mount function", async () => {
      mockLoadModule.mockResolvedValue({ default: mockMfeModule });

      await renderComponent({ mountData: { productId: "abc-123" } });

      expect(mockMfeModule.mount).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        expect.objectContaining({
          productId: "abc-123",
        })
      );
    });

    it("should remove the hidden class from the container when mounted", async () => {
      mockLoadModule.mockResolvedValue({ default: mockMfeModule });

      await renderComponent();

      const container = document.querySelector<HTMLDivElement>(".remote-mfe__container");
      expect(container).not.toHaveClass("remote-mfe__container--hidden");
    });
  });

  describe("error state", () => {
    it("should show the default error UI when loadModule rejects", async () => {
      jest.spyOn(console, "error").mockImplementation();
      mockLoadModule.mockRejectedValue(new Error("Failed to load"));

      await renderComponent();

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("This section is temporarily unavailable")).toBeInTheDocument();
      expect(screen.getByText("Failed to load")).toBeInTheDocument();
    });

    it("should show a custom error fallback when provided", async () => {
      jest.spyOn(console, "error").mockImplementation();
      mockLoadModule.mockRejectedValue(new Error("Load error"));

      await renderComponent({ errorFallback: <div>Custom error UI</div> });

      expect(screen.getByText("Custom error UI")).toBeInTheDocument();
      expect(screen.queryByText("This section is temporarily unavailable")).not.toBeInTheDocument();
    });

    it("should show error UI when the module calls onError", async () => {
      let capturedOnError: ((error: Error) => void) | undefined;
      mockMfeModule.mount.mockImplementation(
        (_container: HTMLElement, options: MfeMountOptions) => {
          capturedOnError = options.onError;
        }
      );
      mockLoadModule.mockResolvedValue({ default: mockMfeModule });

      await renderComponent();

      act(() => {
        capturedOnError?.(new Error("Runtime error"));
      });

      expect(screen.getByText("Runtime error")).toBeInTheDocument();
    });

    it("should convert non-Error thrown values to Error objects", async () => {
      jest.spyOn(console, "error").mockImplementation();
      mockLoadModule.mockRejectedValue("string error");

      await renderComponent();

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("string error")).toBeInTheDocument();
    });

    it("should hide the container div when in error state", async () => {
      jest.spyOn(console, "error").mockImplementation();
      mockLoadModule.mockRejectedValue(new Error("Load error"));

      await renderComponent();

      const container = document.querySelector<HTMLDivElement>(".remote-mfe__container");
      expect(container).toHaveClass("remote-mfe__container--hidden");
    });
  });

  describe("retry", () => {
    it("should retry loading when the retry button is clicked", async () => {
      jest.spyOn(console, "error").mockImplementation();
      const user = userEvent.setup();
      mockLoadModule
        .mockRejectedValueOnce(new Error("First attempt failed"))
        .mockResolvedValueOnce({ default: mockMfeModule });

      await renderComponent();

      await user.click(screen.getByRole("button", { name: "Retry" }));

      await waitFor(() => {
        expect(mockMfeModule.mount).toHaveBeenCalledTimes(1);
      });
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("cleanup", () => {
    it("should unmount the module when the component unmounts", async () => {
      mockLoadModule.mockResolvedValue({ default: mockMfeModule });

      const { unmount } = await renderComponent();

      unmount();

      expect(mockMfeModule.unmount).toHaveBeenCalledTimes(1);
      expect(mockMfeModule.unmount).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it("should not call unmount if the module was never loaded", async () => {
      mockLoadModule.mockReturnValue(
        new Promise(() => {
          // Empty fn
        })
      );

      const { unmount } = await renderComponent();

      unmount();

      expect(mockMfeModule.unmount).not.toHaveBeenCalled();
    });
  });
});
