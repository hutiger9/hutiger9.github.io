<script setup lang="ts">
import { navLinks } from '@/site.config'

const route = useRoute()
</script>

<template>
  <nav class="flex items-center gap-1.5em text-lg max-w-70ch m-auto">
    <NuxtLink
      v-for="link in navLinks" :key="link.path"
      class="hover relative py-1"
      :title="link.title" :to="link.path"
      :class="route.path === link.path ? 'font-semibold' : ''"
    >
      <span class="hidden md:inline">{{ link.title }}</span>
      <div :class="link.icon" class="md:hidden" />
      <!-- Active indicator -->
      <span
        v-if="route.path === link.path"
        class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
        style="background-color:var(--accent)"
      />
    </NuxtLink>
    <DarkMode class="m-l-auto" />
  </nav>
</template>
