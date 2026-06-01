import type { JSX } from "react";
import type { SkeletonShimmerProps } from "@shared/types/props";

import "@shared/components/SkeletonShimmer/SkeletonShimmer.css";

const SkeletonShimmer = ({ rounded, className }: SkeletonShimmerProps): JSX.Element => {
  const classes = ["skeleton-shimmer", rounded && "skeleton-shimmer--rounded", className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}></div>;
};

export default SkeletonShimmer;
