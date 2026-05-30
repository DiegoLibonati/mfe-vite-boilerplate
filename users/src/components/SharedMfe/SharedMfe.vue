<script setup lang="ts" generic="P extends Record<string, unknown>">
import { ref, onMounted, onBeforeUnmount, inject } from "vue";

import type { MfeCallbacks } from "shared/sdk";
import type { SharedMfeProps } from "@users/types/props";

const props = defineProps<SharedMfeProps<P>>();

const containerRef = ref<HTMLDivElement | null>(null);
const callbacks = inject<MfeCallbacks>("mfeCallbacks");

onMounted(() => {
  const el = containerRef.value;
  if (!el) return;

  props.module.mount(el, props.componentProps, callbacks ? { callbacks } : undefined);
});

onBeforeUnmount(() => {
  const el = containerRef.value;
  if (!el) return;

  props.module.unmount(el);
});
</script>

<template>
  <div ref="containerRef" />
</template>
