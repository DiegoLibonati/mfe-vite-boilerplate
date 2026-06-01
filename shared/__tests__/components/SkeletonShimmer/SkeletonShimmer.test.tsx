import { render } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";
import type { SkeletonShimmerProps } from "@shared/types/props";

import SkeletonShimmer from "@shared/components/SkeletonShimmer/SkeletonShimmer";

const renderComponent = (props: SkeletonShimmerProps = {}): RenderResult =>
  render(<SkeletonShimmer {...props} />);

const skeletonOf = (result: RenderResult): HTMLDivElement | null =>
  result.container.querySelector<HTMLDivElement>(".skeleton-shimmer");

describe("SkeletonShimmer", () => {
  describe("rendering", () => {
    it("should render a skeleton-shimmer element", () => {
      const result = renderComponent();

      expect(skeletonOf(result)).toBeInTheDocument();
    });

    it("should not add the rounded modifier by default", () => {
      const result = renderComponent();

      expect(skeletonOf(result)).not.toHaveClass("skeleton-shimmer--rounded");
    });

    it("should add the rounded modifier when rounded is true", () => {
      const result = renderComponent({ rounded: true });

      expect(skeletonOf(result)).toHaveClass("skeleton-shimmer--rounded");
    });

    it("should apply the provided loading className", () => {
      const result = renderComponent({ className: "review-customer__rate-stars-loader" });

      expect(skeletonOf(result)).toHaveClass("review-customer__rate-stars-loader");
    });
  });
});
