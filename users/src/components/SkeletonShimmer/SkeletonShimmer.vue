<script setup lang="ts">
import "@shared/components/SkeletonShimmer/SkeletonShimmer.css";

defineProps<{
  rounded?: boolean;
  loadingClass?: string;
}>();
</script>

<template>
  <div :class="['skeleton-shimmer', rounded && 'skeleton-shimmer--rounded', loadingClass]" />
</template>
