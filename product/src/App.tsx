import type { JSX } from "react";
import type { ProductPageProps } from "@product/types/props";

import ProductPage from "@product/pages/ProductPage/ProductPage";

function App({ productId }: ProductPageProps): JSX.Element {
  return <ProductPage productId={productId} />;
}

export default App;
