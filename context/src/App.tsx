import type { JSX } from "react";

import ContextPage from "@/pages/ContextPage/ContextPage";

import { CounterProvider } from "@/contexts/CounterContext/CounterProvider";

function App(): JSX.Element {
  return (
    <CounterProvider>
      <ContextPage />
    </CounterProvider>
  );
}

export default App;
