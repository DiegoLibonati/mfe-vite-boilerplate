import type { Envs } from "@shared/types/envs";

const envs: Envs = {
  appName: import.meta.env.VITE_APP_NAME as string,
};

export default envs;
