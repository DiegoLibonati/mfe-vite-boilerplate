import { useContext } from "react";

import type { InheritedContext as InheritedContextT } from "@mfe/shared/types/contexts";

import { InheritedContext } from "@mfe/shared/contexts/InheritedContext/InheritedContext";

export const useInheritedContext = (): InheritedContextT | null => {
  return useContext(InheritedContext);
};
