import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";

import type { JSX } from "react";
import type { ProductAppProps } from "@/types/props";

import RemoteMfe from "@/components/RemoteMfe/RemoteMfe";

const ProductApp = ({ callbacks }: ProductAppProps): JSX.Element => {
  const { productId } = useParams();

  const loadModule = useCallback(() => import("product/ProductApp"), []);

  const mountData = useMemo(() => ({ productId: productId ?? "" }), [productId]);

  return <RemoteMfe loadModule={loadModule} callbacks={callbacks} mountData={mountData} />;
};

export default ProductApp;
