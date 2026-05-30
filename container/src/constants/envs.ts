import type { Envs } from "@container/types/envs";

const envs: Envs = {
  redirectIfRouteNotExists: import.meta.env.VITE_REDIRECT_IF_ROUTE_NOT_EXISTS === "true",
  appName: import.meta.env.VITE_APP_NAME as string,
  remoteHomeUrl: import.meta.env.VITE_REMOTE_HOME_URL as string,
  remoteAboutUrl: import.meta.env.VITE_REMOTE_ABOUT_URL as string,
  remoteUsersUrl: import.meta.env.VITE_REMOTE_USERS_URL as string,
  remoteNotFoundUrl: import.meta.env.VITE_REMOTE_NOT_FOUND_URL as string,
  remoteProductUrl: import.meta.env.VITE_REMOTE_PRODUCT_URL as string,
  remoteContextUrl: import.meta.env.VITE_REMOTE_CONTEXT_URL as string,
  apiUrl: import.meta.env.VITE_API_URL as string,
};

export default envs;
