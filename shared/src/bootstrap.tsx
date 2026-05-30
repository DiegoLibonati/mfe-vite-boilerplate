import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "@shared/App";

import "@shared/styles/global.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
