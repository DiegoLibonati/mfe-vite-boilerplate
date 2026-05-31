<script setup lang="ts" generic="P extends Record<string, unknown>">
import { ref, computed, onMounted, onBeforeUnmount, inject } from "vue";

import type { MfeCallbacks } from "shared/sdk";
import type { SharedMfeProps } from "@users/types/props";

const props = defineProps<SharedMfeProps<P>>();

const containerRef = ref<HTMLDivElement | null>(null);
const callbacks = inject<MfeCallbacks>("mfeCallbacks");

// Host div follows the `<className>-wrapper` convention: it derives its class from the
// mounted component's `className` so consumers don't need a manual wrapper element.
// Pass `wrapperClass` to override the inferred name.
const wrapperClass = computed<string | undefined>(() => {
  if (props.wrapperClass) return props.wrapperClass;
  const className = (props.componentProps as { className?: unknown }).className;
  return typeof className === "string" && className ? `${className}-wrapper` : undefined;
});

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
  <div ref="containerRef" :class="wrapperClass" />
</template>
