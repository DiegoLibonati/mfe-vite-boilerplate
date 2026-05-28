import { Outlet } from "react-router-dom";

import type { JSX } from "react";

export const PublicRoute = (): JSX.Element => {
  return <Outlet />;
};
