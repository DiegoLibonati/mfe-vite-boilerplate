import type { JSX } from "react";
import type { InheritedProviderProps } from "@mfe/shared/types/props";

import { InheritedContext } from "@mfe/shared/contexts/InheritedContext/InheritedContext";

export const InheritedProvider = ({ children, callbacks }: InheritedProviderProps): JSX.Element => {
  return (
    <InheritedContext.Provider value={{ callbacks: callbacks }}>
      {children}
    </InheritedContext.Provider>
  );
};
