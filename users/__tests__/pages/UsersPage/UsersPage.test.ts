import { render, screen, within } from "@testing-library/vue";
import { vi } from "vitest";

import type { RenderResult } from "@testing-library/vue";
import type { User } from "shared/sdk";
import type { UsersPageProps } from "@users/types/props";

import UsersPage from "@users/pages/UsersPage/UsersPage.vue";

import { mockUsers } from "@tests/__mocks__/users.mock";
import { mockCallbacks } from "@tests/__mocks__/callbacks.mock";

const { mockLinkModuleMountSpy, mockLinkModuleUnmountSpy, mockLinkModule } = vi.hoisted(() => {
  const mockLinkModuleMountSpy = vi.fn();
  const mockLinkModuleUnmountSpy = vi.fn();
  return {
    mockLinkModuleMountSpy,
    mockLinkModuleUnmountSpy,
    mockLinkModule: { mount: mockLinkModuleMountSpy, unmount: mockLinkModuleUnmountSpy },
  };
});

vi.mock("shared/sdk", () => ({
  LinkModule: mockLinkModule,
}));

const renderPage = (props: Partial<UsersPageProps> = {}): RenderResult => {
  return render(UsersPage, {
    props: { users: mockUsers, ...props },
    global: { provide: { mfeCallbacks: mockCallbacks } },
  });
};

describe("UsersPage", () => {
  describe("rendering", () => {
    it("should render the page title", () => {
      renderPage();

      expect(screen.getByRole("heading", { level: 1, name: "Users Page" })).toBeInTheDocument();
    });

    it("should render the user list with the user list aria-label", () => {
      renderPage();

      expect(screen.getByRole("list", { name: "User list" })).toBeInTheDocument();
    });

    it("should render one card per user with name and username", () => {
      renderPage();

      const list = screen.getByRole("list", { name: "User list" });
      const items = within(list).getAllByRole("listitem");

      expect(items).toHaveLength(2);
      expect(within(list).getByRole("heading", { name: "Leanne Graham" })).toBeInTheDocument();
      expect(within(list).getByRole("heading", { name: "Ervin Howell" })).toBeInTheDocument();
      expect(within(list).getByText("@Bret")).toBeInTheDocument();
      expect(within(list).getByText("@Antonette")).toBeInTheDocument();
    });

    it("should render the navigation landmark", () => {
      renderPage();

      expect(screen.getByRole("navigation", { name: "Page navigation" })).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should render an empty user list when no users are provided", () => {
      renderPage({ users: [] });

      const list = screen.getByRole("list", { name: "User list" });

      expect(within(list).queryAllByRole("listitem")).toHaveLength(0);
    });

    it("should render every user in the provided users array", () => {
      const users: User[] = Array.from({ length: 5 }, (_, index) => ({
        id: index + 1,
        name: `User ${index + 1}`,
        username: `user${index + 1}`,
        email: `user${index + 1}@test.com`,
        phone: "000",
        website: "test.com",
        company: { name: "Co", catchPhrase: "", bs: "" },
      }));

      renderPage({ users });

      const list = screen.getByRole("list", { name: "User list" });
      expect(within(list).getAllByRole("listitem")).toHaveLength(5);
    });
  });

  describe("home link", () => {
    it("should mount the LinkModule with the home link props and the injected callbacks", () => {
      renderPage();

      expect(mockLinkModuleMountSpy).toHaveBeenCalledTimes(1);
      expect(mockLinkModuleMountSpy).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        {
          id: "link-home",
          ariaLabel: "Go to Home Page",
          href: "/",
          target: "_self",
          children: "Go to Home Page",
        },
        { callbacks: mockCallbacks }
      );
    });

    it("should unmount the LinkModule when the page is unmounted", () => {
      const result = renderPage();

      result.unmount();

      expect(mockLinkModuleUnmountSpy).toHaveBeenCalledTimes(1);
      expect(mockLinkModuleUnmountSpy).toHaveBeenCalledWith(expect.any(HTMLElement));
    });
  });
});
