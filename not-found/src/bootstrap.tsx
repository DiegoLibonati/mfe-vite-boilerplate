import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "@not-found/App";

import "@not-found/index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
