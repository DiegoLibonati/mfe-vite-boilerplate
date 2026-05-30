import * as mfeShared from "shared/sdk";

import type { MfeMountOptions } from "shared/sdk";

import App from "@home/App";

import { mount, unmount } from "@home/Home.module";

jest.mock("shared/sdk", () => {
  const actual: Record<string, unknown> = jest.requireActual("shared/sdk");
  return {
    ...actual,
    mount: jest.fn(),
    unmount: jest.fn(),
  };
});

describe("Home.module", () => {
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
