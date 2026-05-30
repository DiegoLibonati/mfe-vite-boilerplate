import { BrowserRouter } from "react-router-dom";

import type { JSX } from "react";

import ErrorBoundary from "@container/components/ErrorBoundary/ErrorBoundary";

import { ContainerRouter } from "@container/router/ContainerRouter";

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ContainerRouter></ContainerRouter>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
