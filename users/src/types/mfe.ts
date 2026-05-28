import type { MfeMountOptions, User } from "@mfe/shared/types";

export interface UsersMfeMountOptions extends MfeMountOptions {
  users: User[];
}
