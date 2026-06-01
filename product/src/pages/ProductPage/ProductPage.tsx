import { lazy } from "react";

import type { JSX } from "react";
import type { ProductPageProps } from "@product/types/props";

import SharedMfe from "@product/components/SharedMfe/SharedMfe";

import "@product/pages/ProductPage/ProductPage.css";

const Link = lazy(() => import("shared/sdk").then((m) => ({ default: m.Link })));
const Action = lazy(() => import("shared/sdk").then((m) => ({ default: m.Action })));

const ProductPage = ({ productId }: ProductPageProps): JSX.Element => {
  const alertProductId = (): void => {
    alert(`Product ID: ${productId}`);
  };

  return (
    <main className="product-page">
      <h1 className="title">Product Page: {productId}</h1>

      <nav aria-label="Page navigation">
        <ul className="links">
          <li>
            <SharedMfe
              component={Link}
              componentProps={{
                id: "product-link-not-found",
                ariaLabel: "Go to an unknown page",
                href: "/pasdasdasdasd",
                target: "_self",
                children: "Go to Not Exists Page",
              }}
            />
          </li>
        </ul>
      </nav>

      <section className="actions" aria-label="Product actions">
        <SharedMfe
          component={Action}
          componentProps={{
            id: "action-show-product-id",
            ariaLabel: `Show product ID ${productId}`,
            onClick: alertProductId,
            children: "Click Product Id",
          }}
        />
      </section>
    </main>
  );
};

export default ProductPage;
