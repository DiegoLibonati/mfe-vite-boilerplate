import type { JSX } from "react";
import type { ProductPageProps } from "@/types/props";

import ProductPage from "@/pages/ProductPage/ProductPage";

function App({ productId }: ProductPageProps): JSX.Element {
  return <ProductPage productId={productId} />;
}

export default App;
