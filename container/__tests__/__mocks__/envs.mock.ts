import type { Envs } from "@/types/envs";

export const mockEnvs: Envs = {
  redirectIfRouteNotExists: false,
  appName: "",
  remoteHomeUrl: "",
  remoteAboutUrl: "",
  remoteUsersUrl: "",
  remoteNotFoundUrl: "",
  remoteProductUrl: "",
  remoteContextUrl: "",
  apiUrl: "",
};

export const mockEnvsWithRedirect: Envs = {
  ...mockEnvs,
  redirectIfRouteNotExists: true,
};
