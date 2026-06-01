export { default as Link } from "@shared/components/Link/Link";
export { default as Action } from "@shared/components/Action/Action";
export { default as DefaultLoading } from "@shared/components/DefaultLoading/DefaultLoading";
export { default as SkeletonShimmer } from "@shared/components/SkeletonShimmer/SkeletonShimmer";
export { default as MfeErrorBoundary } from "@shared/components/MfeErrorBoundary/MfeErrorBoundary";
export { InheritedProvider } from "@shared/contexts/InheritedContext/InheritedProvider";
export { useInheritedContext } from "@shared/hooks/useInheritedContext";
export { mount, unmount } from "@shared/Shared.module";
export * as LinkModule from "@shared/components/Link/Link.module";
export * as ActionModule from "@shared/components/Action/Action.module";
export * as SkeletonShimmerModule from "@shared/components/SkeletonShimmer/SkeletonShimmer.module";
export * as DefaultLoadingModule from "@shared/components/DefaultLoading/DefaultLoading.module";

export type * from "@shared/types";
