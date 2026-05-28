import { createContext } from "react";

import type { CounterContext as CounterContextT } from "@/types/contexts";

export const CounterContext = createContext<CounterContextT | null>(null);
