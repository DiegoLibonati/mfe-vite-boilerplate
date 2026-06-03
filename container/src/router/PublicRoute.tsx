import { Outlet } from "react-router";

import type { JSX } from "react";

export const PublicRoute = (): JSX.Element => {
  return <Outlet />;
};
