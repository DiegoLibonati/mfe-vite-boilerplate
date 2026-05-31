import type { SharedComponentModule } from "shared/sdk";

export interface SharedMfeProps<P> {
  module: SharedComponentModule<P>;
  componentProps: P;
  wrapperClass?: string;
}

export interface ProductPageProps {
  productId: string;
}
