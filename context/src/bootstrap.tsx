import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "@context/App";

import "@context/index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
