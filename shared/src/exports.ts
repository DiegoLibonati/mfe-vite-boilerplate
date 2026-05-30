export { default as Link } from "@shared/components/Link/Link";
export { default as Action } from "@shared/components/Action/Action";
export { InheritedProvider } from "@shared/contexts/InheritedContext/InheritedProvider";
export { useInheritedContext } from "@shared/hooks/useInheritedContext";
export { mount, unmount } from "@shared/mount";
export * as LinkModule from "@shared/components/Link/mount";
export * as ActionModule from "@shared/components/Action/mount";

export type * from "@shared/types";
