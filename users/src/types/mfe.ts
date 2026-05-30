import type { MfeMountOptions, User } from "shared/sdk";

export interface UsersMfeMountOptions extends MfeMountOptions {
  users: User[];
}
