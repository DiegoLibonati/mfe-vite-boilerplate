import { act, render, screen, waitFor } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";
import type { UsersAppProps } from "@/types/props";

import UsersApp from "@/components/UsersApp/UsersApp";

import userService from "@/services/userService";

import { mockUser } from "@tests/__mocks__/user.mock";
import { mockCallbacks } from "@tests/__mocks__/callbacks.mock";

const mockUsersMount = jest.fn();
const mockUsersUnmount = jest.fn();

const mockUserService = jest.mocked(userService);

jest.mock(
  "users/UsersApp",
  () => ({
    __esModule: true,
    default: {
      mount: mockUsersMount,
      unmount: mockUsersUnmount,
    },
  }),
  { virtual: true }
);
jest.mock("@/services/userService");

const renderComponent = async (props: Partial<UsersAppProps> = {}): Promise<RenderResult> => {
  let result!: RenderResult;
  await act(async () => {
    const defaultProps: UsersAppProps = {
      callbacks: mockCallbacks,
      ...props,
    };
    result = render(<UsersApp {...defaultProps} />);
    await Promise.resolve();
  });
  return result;
};

describe("UsersApp", () => {
  describe("loading state", () => {
    it("should show the loading indicator while fetching users", async () => {
      mockUserService.getAll.mockReturnValue(
        new Promise(() => {
          // Empty fn
        })
      );

      await renderComponent();

      expect(screen.getByLabelText("Loading remote module")).toBeInTheDocument();
    });
  });

  describe("success state", () => {
    it("should render the remote module after users are fetched", async () => {
      mockUserService.getAll.mockResolvedValue([mockUser]);

      await renderComponent();

      await waitFor(() => {
        expect(mockUsersMount).toHaveBeenCalledTimes(1);
      });
    });

    it("should pass the fetched users as mountData", async () => {
      mockUserService.getAll.mockResolvedValue([mockUser]);

      await renderComponent();

      await waitFor(() => {
        expect(mockUsersMount).toHaveBeenCalledWith(
          expect.any(HTMLDivElement),
          expect.objectContaining({
            users: [mockUser],
          })
        );
      });
    });

    it("should pass callbacks to the module", async () => {
      mockUserService.getAll.mockResolvedValue([mockUser]);

      await renderComponent();

      await waitFor(() => {
        expect(mockUsersMount).toHaveBeenCalledWith(
          expect.any(HTMLDivElement),
          expect.objectContaining({
            callbacks: mockCallbacks,
          })
        );
      });
    });
  });

  describe("error state", () => {
    it("should show the error message when fetching users fails", async () => {
      mockUserService.getAll.mockRejectedValue(new Error("Network error"));

      await renderComponent();

      expect(await screen.findByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Error loading users")).toBeInTheDocument();
      expect(screen.getByText("Please try again later.")).toBeInTheDocument();
    });

    it("should not render the remote module on error", async () => {
      mockUserService.getAll.mockRejectedValue(new Error("Network error"));

      await renderComponent();

      await screen.findByRole("alert");

      expect(mockUsersMount).not.toHaveBeenCalled();
    });
  });
});
