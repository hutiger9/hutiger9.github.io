<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const props = defineProps<{
  posts: any[]
}>()

const emit = defineEmits<{
  filter: [filtered: any[]]
}>()

const searchQuery = ref('')
const isFocused = ref(false)

// Compute all tags from posts (skip year markers)
const allTags = computed(() => {
  const tagCounts: Record<string, number> = {}
  for (const post of props.posts) {
    if (post.isMarked) continue
    if (post.tags && Array.isArray(post.tags)) {
      for (const tag of post.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      }
    }
  }
  // Sort by count desc, then alphabetically
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }))
})

const doSearch = useDebounceFn((query: string) => {
  if (!query.trim()) {
    emit('filter', props.posts)
    return
  }
  const q = query.toLowerCase()
  const filtered = props.posts.filter((post: any) => {
    if (post.isMarked) return true
    const title = (post.title || '').toLowerCase()
    const desc = (post.description || '').toLowerCase()
    const tags = (post.tags || []).join(' ').toLowerCase()
    return title.includes(q) || desc.includes(q) || tags.includes(q)
  })
  emit('filter', filtered)
}, 300)

watch(searchQuery, (val) => doSearch(val))

function selectTag(tag: string) {
  searchQuery.value = tag
  doSearch(tag)
  // Keep focus so the tag list stays visible
}
</script>

<template>
  <div class="mb-4">
    <div class="relative">
      <input
        v-model="searchQuery"
        placeholder="Search all articles..."
        class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
        :style="{
          backgroundColor: 'var(--input-bg)',
          border: '1px solid var(--c-border)',
          color: 'var(--primary)',
        }"
        @focus="isFocused = true; ($event.target as HTMLElement).style.borderColor = 'var(--accent)'"
        @blur="isFocused = false; ($event.target as HTMLElement).style.borderColor = 'var(--c-border)'"
      >
      <span class="absolute right-3 top-1/2 -translate-y-1/2 op-30 text-sm">
        <i class="i-icon-park-outline-search" />
      </span>
    </div>

    <!-- Tag suggestions (inline, pushes content below) -->
    <Transition name="fade">
      <div
        v-if="isFocused && searchQuery === '' && allTags.length > 0"
        class="mt-1 p-3 rounded-lg shadow-lg"
        :style="{ backgroundColor: 'var(--c-bg-card)', border: '1px solid var(--c-border)' }"
      >
        <div class="text-xs op-50 mb-2 font-medium">
          Browse by tags:
        </div>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="{ tag, count } in allTags"
            :key="tag"
            class="tag-suggestion"
            :style="{
              backgroundColor: 'color-mix(in srgb, var(--accent) 8%, transparent)',
              color: 'var(--accent)',
            }"
            @mousedown.prevent="selectTag(tag)"
          >
            #{{ tag }}
            <span class="op-40 text-xs ml-1">{{ count }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tag-suggestion {
  padding: 3px 10px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.tag-suggestion:hover {
  filter: brightness(0.9);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
