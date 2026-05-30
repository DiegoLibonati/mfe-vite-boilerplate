declare module "home/HomeApp" {
  import type { MfeModule } from "shared/sdk";
  const homeModule: MfeModule;
  export default homeModule;
  export const mount: MfeModule["mount"];
  export const unmount: MfeModule["unmount"];
}

declare module "about/AboutApp" {
  import type { MfeModule } from "shared/sdk";
  const aboutModule: MfeModule;
  export default aboutModule;
  export const mount: MfeModule["mount"];
  export const unmount: MfeModule["unmount"];
}

declare module "users/UsersApp" {
  import type { MfeModule } from "shared/sdk";
  const usersModule: MfeModule;
  export default usersModule;
  export const mount: MfeModule["mount"];
  export const unmount: MfeModule["unmount"];
}

declare module "not-found/NotFoundApp" {
  import type { MfeModule } from "shared/sdk";
  const notFoundModule: MfeModule;
  export default notFoundModule;
  export const mount: MfeModule["mount"];
  export const unmount: MfeModule["unmount"];
}

declare module "product/ProductApp" {
  import type { MfeModule } from "shared/sdk";
  const productModule: MfeModule;
  export default productModule;
  export const mount: MfeModule["mount"];
  export const unmount: MfeModule["unmount"];
}

declare module "context/ContextApp" {
  import type { MfeModule } from "shared/sdk";
  const contextModule: MfeModule;
  export default contextModule;
  export const mount: MfeModule["mount"];
  export const unmount: MfeModule["unmount"];
}
