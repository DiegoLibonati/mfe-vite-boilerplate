import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "@home/App";

import "@home/index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
