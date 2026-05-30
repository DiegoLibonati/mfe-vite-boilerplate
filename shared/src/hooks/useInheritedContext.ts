import { useContext } from "react";

import type { InheritedContext as InheritedContextT } from "@shared/types/contexts";

import { InheritedContext } from "@shared/contexts/InheritedContext/InheritedContext";

export const useInheritedContext = (): InheritedContextT | null => {
  return useContext(InheritedContext);
};
