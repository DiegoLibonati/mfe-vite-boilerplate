<script setup lang="ts" generic="P extends Record<string, unknown>">
import { ref, onErrorCaptured } from "vue";

import type { SharedMfeProps } from "@users/types/props";

import SkeletonShimmer from "@users/components/SkeletonShimmer/SkeletonShimmer.vue";
import SharedMfeMount from "@users/components/SharedMfe/SharedMfeMount.vue";

const props = defineProps<SharedMfeProps<P>>();

const failed = ref(false);

onErrorCaptured((err): boolean => {
  console.error("[Shared MFE Load Error]", err);
  failed.value = true;
  return false;
});
</script>

<template>
  <Suspense v-if="!failed">
    <SharedMfeMount
      :loader="props.loader"
      :component-props="props.componentProps"
      :wrapper-class="props.wrapperClass!"
    />
    <template #fallback>
      <SkeletonShimmer :loading-class="props.loadingClass!" />
    </template>
  </Suspense>
</template>
