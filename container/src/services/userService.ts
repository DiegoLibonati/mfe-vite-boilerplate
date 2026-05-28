import type { User } from "@mfe/shared/types";
import type { ResponseDirect } from "@/types/responses";

const userService = {
  getAll: async (): Promise<ResponseDirect<User[]>> => {
    const response = await fetch(`/api/users`);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as ResponseDirect<User[]>;
  },

  getById: async (id: number): Promise<ResponseDirect<User>> => {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as ResponseDirect<User>;
  },
};

export default userService;
