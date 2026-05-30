<script setup lang="ts">
import type { UserCardProps } from "@users/types/props";

defineProps<UserCardProps>();
</script>

<template>
  <article class="user-card" :aria-label="`User card for ${name}`">
    <h2 class="user-card__name">{{ name }}</h2>
    <p class="user-card__username">@{{ username }}</p>
    <p class="user-card__detail"><span class="user-card__label">Email:</span> {{ email }}</p>
    <p class="user-card__detail"><span class="user-card__label">Phone:</span> {{ phone }}</p>
    <p class="user-card__detail"><span class="user-card__label">Website:</span> {{ website }}</p>
    <p class="user-card__detail">
      <span class="user-card__label">Company:</span> {{ company.name }}
    </p>
  </article>
</template>

<style>
.user-card {
  background-color: var(--color-card-bg, #1e1e2e);
  border-radius: 0.5rem;
  padding: 1rem;
  color: var(--color-white);
  border: 0.063rem solid var(--color-border, #333);
  transition: transform 0.2s ease;
}

.user-card:hover {
  transform: translateY(-0.125rem);
}

.user-card__name {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.user-card__username {
  color: var(--color-accent, #7c7cf0);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.user-card__detail {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  word-break: break-word;
}

.user-card__label {
  font-weight: bold;
  color: var(--color-accent, #7c7cf0);
}
</style>
