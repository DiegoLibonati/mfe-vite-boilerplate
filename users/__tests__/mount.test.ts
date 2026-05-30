import { createApp } from "vue";
import { vi } from "vitest";

import type * as Vue from "vue";
import type { Mock } from "vitest";
import type { UsersMfeMountOptions } from "@users/types/mfe";

import UsersPage from "@users/pages/UsersPage/UsersPage.vue";

import { mount, unmount } from "@users/mount";

interface MockApp {
  config: { errorHandler?: (error: unknown) => void };
  provide: Mock;
  mount: Mock;
  unmount: Mock;
}

vi.mock("vue", async () => {
  const actual = await vi.importActual<typeof Vue>("vue");
  return { ...actual, createApp: vi.fn() };
});

vi.mock("shared/sdk", () => ({
  LinkModule: { mount: vi.fn(), unmount: vi.fn() },
}));

const buildOptions = (): UsersMfeMountOptions => ({
  callbacks: { onNavigate: vi.fn() },
  users: [
    {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz",
      phone: "1-770-736-8031 x56442",
      website: "hildegard.org",
      company: { name: "Romaguera-Crona", catchPhrase: "", bs: "" },
    },
  ],
});

const createMockApp = (): MockApp => ({
  config: {},
  provide: vi.fn(),
  mount: vi.fn(),
  unmount: vi.fn(),
});

describe("mount.ts", () => {
  let container: HTMLElement;
  let options: UsersMfeMountOptions;
  let mockApp: MockApp;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    options = buildOptions();
    mockApp = createMockApp();
    (createApp as unknown as Mock).mockReturnValue(mockApp);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    try {
      unmount(container);
    } catch {
      // noop
    }
  });

  describe("mount", () => {
    it("should call createApp with the UsersPage component and the users prop", () => {
      mount(container, options);

      expect(createApp).toHaveBeenCalledTimes(1);
      expect(createApp).toHaveBeenCalledWith(UsersPage, { users: options.users });
    });

    it("should provide mfeCallbacks with the provided callbacks", () => {
      mount(container, options);

      expect(mockApp.provide).toHaveBeenCalledTimes(1);
      expect(mockApp.provide).toHaveBeenCalledWith("mfeCallbacks", options.callbacks);
    });

    it("should mount the app on the provided container", () => {
      mount(container, options);

      expect(mockApp.mount).toHaveBeenCalledTimes(1);
      expect(mockApp.mount).toHaveBeenCalledWith(container);
    });

    it("should unmount the previous app before re-mounting the same container", () => {
      mount(container, options);
      const firstApp = mockApp;

      mockApp = createMockApp();
      (createApp as unknown as Mock).mockReturnValue(mockApp);

      mount(container, options);

      expect(firstApp.unmount).toHaveBeenCalledTimes(1);
      expect(mockApp.mount).toHaveBeenCalledWith(container);
    });

    it("should mount separately on different containers without unmounting the other", () => {
      const otherContainer = document.createElement("div");
      document.body.appendChild(otherContainer);

      mount(container, options);
      const firstApp = mockApp;

      mockApp = createMockApp();
      (createApp as unknown as Mock).mockReturnValue(mockApp);

      mount(otherContainer, options);

      expect(firstApp.unmount).not.toHaveBeenCalled();
      expect(mockApp.mount).toHaveBeenCalledWith(otherContainer);
    });
  });

  describe("unmount", () => {
    it("should call app.unmount when the container was previously mounted", () => {
      mount(container, options);

      unmount(container);

      expect(mockApp.unmount).toHaveBeenCalledTimes(1);
    });

    it("should remove the container from the apps map so a subsequent mount does not re-unmount", () => {
      mount(container, options);
      unmount(container);

      const previousApp = mockApp;
      mockApp = createMockApp();
      (createApp as unknown as Mock).mockReturnValue(mockApp);

      mount(container, options);

      expect(previousApp.unmount).toHaveBeenCalledTimes(1);
    });

    it("should not throw and not call unmount when the container was never mounted", () => {
      expect(() => {
        unmount(container);
      }).not.toThrow();
      expect(mockApp.unmount).not.toHaveBeenCalled();
    });
  });
});
