import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "@product/App";

import "@product/index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <App productId="1" />
  </StrictMode>
);
