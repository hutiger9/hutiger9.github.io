<script setup lang="ts">
import { navLinks, socialLinks } from '@/site.config'

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

    <!-- Right side: photo wall + social icons + dark mode -->
    <div class="m-l-auto flex items-center gap-3">
      <NuxtLink
        to="/photos"
        title="Photos"
        class="op-40 hover:op-70 transition-opacity text-base"
        :class="route.path === '/photos' ? 'op-80' : ''"
      >
        <div class="i-icon-park-outline-picture-album" />
      </NuxtLink>
      <a
        v-for="link in socialLinks" :key="link.title"
        :title="link.title" :href="link.path"
        class="op-40 hover:op-70 transition-opacity text-base" target="_blank"
      >
        <div :class="link.icon" />
      </a>
      <span class="w-px h-4 op-20" style="background-color:var(--c-text)" />
      <DarkMode />
    </div>
  </nav>
</template>
