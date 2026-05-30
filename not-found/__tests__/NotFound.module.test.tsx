import * as mfeShared from "shared/sdk";

import type { MfeMountOptions } from "shared/sdk";

import App from "@not-found/App";

import { mount, unmount } from "@not-found/NotFound.module";

jest.mock("shared/sdk", () => {
  const actual: Record<string, unknown> = jest.requireActual("shared/sdk");
  return {
    ...actual,
    mount: jest.fn(),
    unmount: jest.fn(),
  };
});

describe("NotFound.module", () => {
  describe("mount", () => {
    it("should call shared mount with App, the container and options", () => {
      const container = document.createElement("div");
      const options: MfeMountOptions = {
        callbacks: { onNavigate: jest.fn() },
      };

      mount(container, options);

      expect(mfeShared.mount).toHaveBeenCalledTimes(1);
      expect(mfeShared.mount).toHaveBeenCalledWith(App, container, options);
    });
  });

  describe("unmount", () => {
    it("should re-export unmount from shared", () => {
      expect(unmount).toBe(mfeShared.unmount);
    });
  });
});
