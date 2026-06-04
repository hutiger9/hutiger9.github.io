<script setup lang="ts">
import { formattedDate, getReadingTime, getTagColor } from '@/utils'
import { useViewCount } from '@/useViewCount'

const props = defineProps(['article'])
const { views, increaseCount } = useViewCount(props.article._path)

const readingTime = computed(() => {
  const text = props.article.body?.children
    ?.map((c: any) => c.children?.map((cc: any) => cc.value).join(' ')).join(' ')
    || props.article.description || ''
  return getReadingTime(text)
})

const tagStyles = computed(() => {
  if (!props.article.tags) return []
  return props.article.tags.map((tag: string) => {
    const c = getTagColor(tag)
    return {
      '--tag-bg': c.bg,
      '--tag-text': c.text,
      '--tag-bg-dark': c.darkBg,
      '--tag-text-dark': c.darkText,
    } as Record<string, string>
  })
})

onMounted(() => {
  increaseCount()
})
</script>

<template>
  <NuxtLink :to="`/p${props.article._path}`">
    <li class="card list-none mb-5 p-5">
      <!-- Title row -->
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-lg font-semibold leading-snug">
          {{ props.article.title }}
        </h3>
        <!-- View count: eye always visible, number on hover -->
        <span class="shrink-0 flex items-center text-xs mt-1 group cursor-pointer">
          <!-- inline SVG eye icon (always visible) -->
          <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 36 36" class="group-hover:hidden">
            <path fill="currentColor" d="M33.62 17.53c-3.37-6.23-9.28-10-15.82-10S5.34 11.3 2 17.53l-.28.47l.26.48c3.37 6.23 9.28 10 15.82 10s12.46-3.72 15.82-10l.26-.48Zm-15.82 8.9C12.17 26.43 7 23.29 4 18c3-5.29 8.17-8.43 13.8-8.43S28.54 12.72 31.59 18c-3.05 5.29-8.17 8.43-13.79 8.43" class="clr-i-outline clr-i-outline-path-1"/>
            <path fill="currentColor" d="M18.09 11.17A6.86 6.86 0 1 0 25 18a6.86 6.86 0 0 0-6.91-6.83m0 11.72A4.86 4.86 1 1 1 23 18a4.87 4.87 0 0 1-4.91 4.89" class="clr-i-outline clr-i-outline-path-2"/>
            <path fill="none" d="M0 0h36v36H0z"/>
          </svg>
          <span class="hidden group-hover:inline">{{ views ?? '...' }}</span>
        </span>
      </div>

      <!-- Description -->
      <p v-if="props.article.description" class="text-sm op-60 mt-2 line-clamp-2 leading-relaxed">
        {{ props.article.description }}
      </p>

      <!-- Tags -->
      <div v-if="props.article.tags?.length" class="flex flex-wrap gap-1.5 mt-3">
        <span
          v-for="(tag, i) in props.article.tags"
          :key="tag"
          class="tag-badge color-tag"
          :style="tagStyles[i]"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Meta row -->
      <div class="flex items-center gap-4 mt-3 text-xs op-50">
        <span class="flex items-center gap-1">
          <i class="i-icon-park-outline-calendar" />
          {{ formattedDate(props.article.date) }}
        </span>
        <span class="flex items-center gap-1">
          <i class="i-icon-park-outline-time" />
          {{ readingTime }} min read
        </span>
      </div>
    </li>
  </NuxtLink>
</template>

<style scoped>
.color-tag {
  background-color: var(--tag-bg);
  color: var(--tag-text);
}
html.dark .color-tag {
  background-color: var(--tag-bg-dark);
  color: var(--tag-text-dark);
}
</style>