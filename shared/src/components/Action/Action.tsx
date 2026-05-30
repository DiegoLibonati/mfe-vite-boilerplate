import type { JSX } from "react";
import type { ActionProps } from "@shared/types/props";

import "@shared/components/Action/Action.css";

const Action = ({ id, ariaLabel, children, className, onClick }: ActionProps): JSX.Element => {
  return (
    <button
      id={id}
      type="button"
      aria-label={ariaLabel}
      className={["action", className].filter(Boolean).join(" ")}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Action;
