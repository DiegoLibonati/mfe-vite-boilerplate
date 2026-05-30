import type { JSX } from "react";

import ContextPage from "@context/pages/ContextPage/ContextPage";

import { CounterProvider } from "@context/contexts/CounterContext/CounterProvider";

function App(): JSX.Element {
  return (
    <CounterProvider>
      <ContextPage />
    </CounterProvider>
  );
}

export default App;
