import type { SkeletonShimmerProps } from "@shared/types/props";

import SkeletonShimmer from "@shared/components/SkeletonShimmer/SkeletonShimmer";

import { createComponentMount } from "@shared/helpers/createComponentMount";

const { mount, unmount } = createComponentMount<SkeletonShimmerProps>(SkeletonShimmer);

export { mount, unmount };
