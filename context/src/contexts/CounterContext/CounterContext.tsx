import { createContext } from "react";

import type { CounterContext as CounterContextT } from "@context/types/contexts";

export const CounterContext = createContext<CounterContextT | null>(null);
