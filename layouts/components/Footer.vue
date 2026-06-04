<script setup lang="ts">
import { siteConfig, socialLinks } from '@/site.config'

</script>

<template>
  <footer class="pt-5em">
    <div class="flex justify-center gap-4 mb-4">
      <a
        v-for="link in socialLinks" :key="link.title"
        :title="link.title" :href="link.path"
        class="op-40 hover:op-70 transition-opacity" target="_blank"
      >
        <div :class="link.icon" class="text-lg" />
      </a>
    </div>
    <div class="flex items-center flex-col md:flex-row gap-1em">
      <span class="op-50 text-sm">
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" class="link">
          CC BY-NC-SA 4.0
        </a>
        2023-PRESENT © {{ siteConfig.author }}
      </span>
    </div>
  </footer>
</template>
