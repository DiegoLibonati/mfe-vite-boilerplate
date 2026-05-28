import type { JSX } from "react";
import type { LinkProps } from "@mfe/shared/types/props";

import { useInheritedContext } from "@mfe/shared/hooks/useInheritedContext";

import "@mfe/shared/components/Link/Link.css";

const Link = ({
  id,
  href,
  target = "_blank",
  ariaLabel,
  children,
  className,
}: LinkProps): JSX.Element => {
  const inherited = useInheritedContext();
  const isEmbedded = inherited !== null;
  const isExternal = target === "_blank";

  const resolvedClassName = ["link", className].filter(Boolean).join(" ");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    if (isExternal) return;

    e.preventDefault();

    if (isEmbedded) {
      inherited.callbacks.onNavigate(href);
    }
  };

  return (
    <a
      id={id}
      href={href}
      target={target}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={resolvedClassName}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

export default Link;
