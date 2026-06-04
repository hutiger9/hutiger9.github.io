<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const props = defineProps<{
  posts: any[]
}>()

const emit = defineEmits<{
  filter: [filtered: any[]]
}>()

const searchQuery = ref('')

const doSearch = useDebounceFn((query: string) => {
  if (!query.trim()) {
    emit('filter', props.posts)
    return
  }
  const q = query.toLowerCase()
  const filtered = props.posts.filter((post: any) => {
    if (post.isMarked) return true // keep year markers
    const title = (post.title || '').toLowerCase()
    const desc = (post.description || '').toLowerCase()
    const tags = (post.tags || []).join(' ').toLowerCase()
    return title.includes(q) || desc.includes(q) || tags.includes(q)
  })
  emit('filter', filtered)
}, 300)

watch(searchQuery, (val) => doSearch(val))
</script>

<template>
  <div class="relative mb-4">
    <input
      v-model="searchQuery"
      placeholder="Search all articles..."
      class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
      :style="{
        backgroundColor: 'var(--input-bg)',
        border: '1px solid var(--c-border)',
        color: 'var(--primary)',
      }"
      @focus="$event.target.style.borderColor = 'var(--accent)'"
      @blur="$event.target.style.borderColor = 'var(--c-border)'"
    >
    <span class="absolute right-3 top-1/2 -translate-y-1/2 op-30 text-sm">
      <i class="i-icon-park-outline-search" />
    </span>
  </div>
</template>
