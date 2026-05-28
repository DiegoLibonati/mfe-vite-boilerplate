import { render, screen } from "@testing-library/vue";

import type { RenderResult } from "@testing-library/vue";
import type { UserCardProps } from "@/types/props";

import UserCard from "@/components/UserCard/UserCard.vue";

const defaultProps: UserCardProps = {
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  company: {
    name: "Romaguera-Crona",
    catchPhrase: "Multi-layered client-server neural-net",
    bs: "harness real-time e-markets",
  },
};

const renderComponent = (props: Partial<UserCardProps> = {}): RenderResult => {
  return render(UserCard, {
    props: { ...defaultProps, ...props },
  });
};

describe("UserCard", () => {
  describe("rendering", () => {
    it("should render the user name as the heading", () => {
      renderComponent();

      expect(screen.getByRole("heading", { name: "Leanne Graham" })).toBeInTheDocument();
    });

    it("should render the username prefixed with @", () => {
      renderComponent();

      expect(screen.getByText("@Bret")).toBeInTheDocument();
    });

    it("should render the email", () => {
      renderComponent();

      expect(screen.getByText(/Sincere@april\.biz/)).toBeInTheDocument();
    });

    it("should render the phone", () => {
      renderComponent();

      expect(screen.getByText(/1-770-736-8031 x56442/)).toBeInTheDocument();
    });

    it("should render the website", () => {
      renderComponent();

      expect(screen.getByText(/hildegard\.org/)).toBeInTheDocument();
    });

    it("should render the company name", () => {
      renderComponent();

      expect(screen.getByText(/Romaguera-Crona/)).toBeInTheDocument();
    });

    it("should set an aria-label that includes the user name", () => {
      renderComponent();

      expect(screen.getByLabelText("User card for Leanne Graham")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should render a different user name when the name prop changes", () => {
      renderComponent({ name: "Ervin Howell" });

      expect(screen.getByRole("heading", { name: "Ervin Howell" })).toBeInTheDocument();
      expect(screen.getByLabelText("User card for Ervin Howell")).toBeInTheDocument();
    });

    it("should render the company name from the provided company object", () => {
      renderComponent({
        company: {
          name: "Deckow-Crist",
          catchPhrase: "Proactive didactic contingency",
          bs: "synergize scalable supply-chains",
        },
      });

      expect(screen.getByText(/Deckow-Crist/)).toBeInTheDocument();
    });

    it("should render empty strings without crashing", () => {
      renderComponent({
        name: "",
        username: "",
        email: "",
        phone: "",
        website: "",
      });

      expect(screen.getByRole("heading")).toBeInTheDocument();
    });
  });
});
