<script setup lang="ts">
import { formattedDate } from '@/utils'
import ViewCount from '@/components/ViewCount.vue'

const props = defineProps(['article'])
</script>

<template>
  <NuxtLink :to="`/p${props.article._path}`">
    <li
      :title="props.article.title"
      class="hover list-none mb-6 mt-2 flex flex-col md:(gap-2 flex-row items-center justify-between)"
    >
      <div class="flex items-center gap-2">
        <span class="text-lg">
          {{ props.article.title }}
        </span>
        <ViewCount :slug="props.article._path" />
      </div>
      <span class="text-sm op-70">
        {{ formattedDate(props.article.date) }}
      </span>
    </li>
  </NuxtLink>
</template>