<script setup lang="ts">
import { LinkModule } from "shared/sdk";

import type { LinkProps } from "shared/sdk";
import type { UsersPageProps } from "@users/types/props";

import UserCard from "@users/components/UserCard/UserCard.vue";
import SharedMfe from "@users/components/SharedMfe/SharedMfe.vue";

defineProps<UsersPageProps>();

const homeLinkProps: Omit<LinkProps, "children"> & { children: string } = {
  id: "link-home",
  ariaLabel: "Go to Home Page",
  href: "/",
  target: "_self",
  children: "Go to Home Page",
};
</script>

<template>
  <main class="users-page">
    <h1 class="title">Users Page</h1>

    <ul class="users-list" aria-label="User list">
      <li v-for="user in users" :key="user.id">
        <UserCard
          :name="user.name"
          :company="user.company"
          :email="user.email"
          :phone="user.phone"
          :username="user.username"
          :website="user.website"
        />
      </li>
    </ul>

    <nav aria-label="Page navigation">
      <ul class="links">
        <li>
          <SharedMfe :module="LinkModule" :component-props="homeLinkProps" />
        </li>
      </ul>
    </nav>
  </main>
</template>

<style>
.users-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.users-page .title {
  color: var(--color-white);
  font-size: clamp(2rem, 10vw, 5rem);
  margin-bottom: 1.5rem;
}

.users-page .users-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17.5rem, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 75rem;
}

.users-page .loading {
  color: var(--color-white);
  font-size: 1.25rem;
}

.users-page .error {
  color: var(--color-accent);
  font-size: 1.25rem;
}

.users-page .links {
  margin-top: 2rem;
}
</style>
