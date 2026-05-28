import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import type { UseMfeCallbacks } from "@/types/hooks";

export const useMfeCallbacks = (): UseMfeCallbacks => {
  const navigate = useNavigate();

  const onNavigate = useCallback(
    (path: string): void => {
      void navigate(path);
    },
    [navigate]
  );

  return useMemo(
    (): UseMfeCallbacks => ({
      onNavigate,
    }),
    [onNavigate]
  );
};
