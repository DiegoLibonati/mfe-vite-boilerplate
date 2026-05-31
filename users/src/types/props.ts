import type { SharedComponentModule, User, UserCompany } from "shared/sdk";

export interface SharedMfeProps<P> {
  module: SharedComponentModule<P>;
  componentProps: P;
  wrapperClass?: string;
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
