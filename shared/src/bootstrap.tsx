import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "@shared/App";

import "@shared/styles/global.css";

const rootElement = document.getElementById("root")!;
rootElement.dataset.mfe = "shared";

const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
