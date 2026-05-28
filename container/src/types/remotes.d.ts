declare module "home/HomeApp" {
  import type { MfeModule } from "@mfe/shared/types";
  const homeModule: MfeModule;
  export default homeModule;
  export const mount: MfeModule["mount"];
  export const unmount: MfeModule["unmount"];
}

declare module "about/AboutApp" {
  import type { MfeModule } from "@mfe/shared/types";
  const aboutModule: MfeModule;
  export default aboutModule;
  export const mount: MfeModule["mount"];
  export const unmount: MfeModule["unmount"];
}

declare module "users/UsersApp" {
  import type { MfeModule } from "@mfe/shared/types";
  const usersModule: MfeModule;
  export default usersModule;
  export const mount: MfeModule["mount"];
  export const unmount: MfeModule["unmount"];
}

declare module "notfound/NotFoundApp" {
  import type { MfeModule } from "@mfe/shared/types";
  const notfoundModule: MfeModule;
  export default notfoundModule;
  export const mount: MfeModule["mount"];
  export const unmount: MfeModule["unmount"];
}

declare module "product/ProductApp" {
  import type { MfeModule } from "@mfe/shared/types";
  const productModule: MfeModule;
  export default productModule;
  export const mount: MfeModule["mount"];
  export const unmount: MfeModule["unmount"];
}

declare module "context/ContextApp" {
  import type { MfeModule } from "@mfe/shared/types";
  const contextModule: MfeModule;
  export default contextModule;
  export const mount: MfeModule["mount"];
  export const unmount: MfeModule["unmount"];
}
