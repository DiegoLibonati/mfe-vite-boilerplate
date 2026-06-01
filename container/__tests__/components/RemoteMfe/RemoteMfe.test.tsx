import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";
import type { MfeMountOptions } from "shared/sdk";
import type { RemoteMfeProps } from "@container/types/props";

import RemoteMfe from "@container/components/RemoteMfe/RemoteMfe";

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
          // Never resolves: keeps Suspense in its loading state.
        })
      );

      await renderComponent();

      expect(screen.getByLabelText("Loading remote module")).toBeInTheDocument();
    });
  });

  describe("mounted state", () => {
    it("should mount the loaded module with callbacks and an onError handler", async () => {
      mockLoadModule.mockResolvedValue({ default: mockMfeModule });

      await renderComponent();

      await waitFor(() => {
        expect(mockMfeModule.mount).toHaveBeenCalledTimes(1);
      });
      expect(mockMfeModule.mount).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        expect.objectContaining({ callbacks: mockCallbacks, onError: expect.any(Function) })
      );
    });

    it("should hide the loading fallback once mounted", async () => {
      mockLoadModule.mockResolvedValue({ default: mockMfeModule });

      await renderComponent();

      await waitFor(() => {
        expect(mockMfeModule.mount).toHaveBeenCalled();
      });
      expect(screen.queryByLabelText("Loading remote module")).not.toBeInTheDocument();
    });

    it("should handle modules without a default export", async () => {
      mockLoadModule.mockResolvedValue(mockMfeModule);

      await renderComponent();

      await waitFor(() => {
        expect(mockMfeModule.mount).toHaveBeenCalledTimes(1);
      });
    });

    it("should pass mountData to the module mount function", async () => {
      mockLoadModule.mockResolvedValue({ default: mockMfeModule });

      await renderComponent({ mountData: { productId: "abc-123" } });

      await waitFor(() => {
        expect(mockMfeModule.mount).toHaveBeenCalledWith(
          expect.any(HTMLDivElement),
          expect.objectContaining({ productId: "abc-123" })
        );
      });
    });

    it("should reveal the mounted container", async () => {
      mockLoadModule.mockResolvedValue({ default: mockMfeModule });

      await renderComponent();

      await waitFor(() => {
        expect(document.querySelector<HTMLDivElement>(".remote-mfe__container")).not.toHaveClass(
          "remote-mfe__container--hidden"
        );
      });
    });
  });

  describe("error state", () => {
    it("should show the default error UI when loadModule rejects", async () => {
      jest.spyOn(console, "error").mockImplementation();
      mockLoadModule.mockRejectedValue(new Error("Failed to load"));

      await renderComponent();

      expect(await screen.findByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("This section is temporarily unavailable")).toBeInTheDocument();
      expect(screen.getByText("Failed to load")).toBeInTheDocument();
    });

    it("should show the error UI when the module calls onError", async () => {
      jest.spyOn(console, "error").mockImplementation();
      let capturedOnError: ((error: Error) => void) | undefined;
      mockMfeModule.mount.mockImplementation(
        (_container: HTMLElement, options: MfeMountOptions) => {
          capturedOnError = options.onError;
        }
      );
      mockLoadModule.mockResolvedValue({ default: mockMfeModule });

      await renderComponent();
      await waitFor(() => {
        expect(capturedOnError).toBeDefined();
      });

      act(() => {
        capturedOnError?.(new Error("Runtime error"));
      });

      expect(await screen.findByText("Runtime error")).toBeInTheDocument();
    });

    it("should convert non-Error thrown values to Error objects", async () => {
      jest.spyOn(console, "error").mockImplementation();
      mockLoadModule.mockRejectedValue("string error");

      await renderComponent();

      expect(await screen.findByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("string error")).toBeInTheDocument();
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
      await screen.findByRole("button", { name: "Retry" });

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

      const result = await renderComponent();
      await waitFor(() => {
        expect(mockMfeModule.mount).toHaveBeenCalled();
      });

      result.unmount();

      expect(mockMfeModule.unmount).toHaveBeenCalledTimes(1);
      expect(mockMfeModule.unmount).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it("should not call unmount if the module was never loaded", async () => {
      mockLoadModule.mockReturnValue(
        new Promise(() => {
          // Never resolves.
        })
      );

      const result = await renderComponent();

      result.unmount();

      expect(mockMfeModule.unmount).not.toHaveBeenCalled();
    });
  });

  describe("wrapper class", () => {
    it("should infer a <className>-wrapper class on the mounted host", async () => {
      mockLoadModule.mockResolvedValue({ default: mockMfeModule });

      await renderComponent({ mountData: { className: "foo" } });

      await waitFor(() => {
        const container = document.querySelector<HTMLDivElement>(".remote-mfe__container");
        expect(container).toHaveClass("foo-wrapper", "remote-mfe__container");
      });
    });

    it("should let wrapperClass override the inferred name", async () => {
      mockLoadModule.mockResolvedValue({ default: mockMfeModule });

      await renderComponent({ mountData: { className: "foo" }, wrapperClass: "bar" });

      await waitFor(() => {
        const container = document.querySelector<HTMLDivElement>(".remote-mfe__container");
        expect(container).toHaveClass("bar", "remote-mfe__container");
        expect(container).not.toHaveClass("foo-wrapper");
      });
    });
  });
});
