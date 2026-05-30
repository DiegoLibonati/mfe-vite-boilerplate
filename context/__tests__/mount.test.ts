import * as mfeShared from "shared/sdk";

import type { MfeMountOptions } from "shared/sdk";

import App from "@context/App";

import { mount, unmount } from "@context/mount";

jest.mock("shared/sdk", () => {
  const actual: Record<string, unknown> = jest.requireActual("shared/sdk");
  return {
    ...actual,
    mount: jest.fn(),
    unmount: jest.fn(),
  };
});

describe("mount", () => {
  describe("mount", () => {
    it("should call shared mount with the App component, container, and options", () => {
      const container = document.createElement("div");
      const mockOptions: MfeMountOptions = {
        callbacks: {
          onNavigate: jest.fn(),
        },
      };

      mount(container, mockOptions);

      expect(mfeShared.mount).toHaveBeenCalledTimes(1);
      expect(mfeShared.mount).toHaveBeenCalledWith(App, container, mockOptions);
    });
  });

  describe("unmount", () => {
    it("should re-export unmount from shared", () => {
      expect(unmount).toBe(mfeShared.unmount);
    });
  });
});
