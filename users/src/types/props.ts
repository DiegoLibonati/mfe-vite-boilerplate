import type { SharedComponentModule, User, UserCompany } from "@mfe/shared/types";

export interface SharedMfeProps<P extends Record<string, unknown>> {
  module: SharedComponentModule<P>;
  componentProps: P;
}

export interface SharedMfeProps<P> {
  module: SharedComponentModule<P>;
  componentProps: P;
}

export interface UserCardProps {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: UserCompany;
}

export interface UsersPageProps {
  users: User[];
}
