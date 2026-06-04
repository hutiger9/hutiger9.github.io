<script setup lang="ts">
import { formattedDate } from '@/utils'

interface ArchiveItem {
  year: number
  posts: Array<{
    _path: string
    title: string
    date: string
    category: string
  }>
}

const allContent = await queryContent()
  .sort({ date: -1 })
  .find()

const archive = computed<ArchiveItem[]>(() => {
  const posts = allContent
    .filter((p: any) => p.title && p.date && !p._file?.match(/(readme|about|404)\.md$/i))
    .map((p: any) => ({
      _path: p._path,
      title: p.title,
      date: p.date,
      category: p._path?.split('/')[1] || 'blog',
    }))

  const grouped: Record<number, ArchiveItem['posts']> = {}
  for (const post of posts) {
    const year = new Date(post.date).getFullYear()
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(post)
  }

  return Object.entries(grouped)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, posts]) => ({ year: Number(year), posts }))
})
</script>

<template>
  <div class="slide-enter-content">
    <h1 class="text-title mb-6 font-bold">
      Archive
    </h1>

    <div v-for="(group, gIdx) in archive" :key="group.year"
      slide-enter :style="{ '--stagger': gIdx + 1 }"
    >
      <!-- Year heading -->
      <h2 class="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
        <span class="inline-block w-3 h-3 rounded-full" style="background-color:var(--accent)" />
        {{ group.year }}
        <span class="text-sm op-40 font-normal">· {{ group.posts.length }} posts</span>
      </h2>

      <!-- Timeline list -->
      <div class="relative pl-6 border-l-2 ml-1.5"
        :style="{ borderColor: 'var(--c-border)' }"
      >
        <NuxtLink
          v-for="(post, pIdx) in group.posts" :key="post._path"
          :to="`/p${post._path}`"
          class="block relative pb-5 last:pb-2 group"
        >
          <!-- Dot marker -->
          <span class="absolute -left-[calc(1.5rem+5px)] top-1 w-2.5 h-2.5 rounded-full border-2 transition-colors duration-200 group-hover:scale-125"
            :style="{
              backgroundColor: 'var(--c-bg)',
              borderColor: 'var(--c-border)',
            }"
          />

          <div class="flex items-start gap-4">
            <span class="text-sm op-40 shrink-0 w-12 pt-0.5 font-mono">
              {{ formattedDate(post.date).slice(5) }}
            </span>
            <div class="min-w-0 flex-1">
              <span class="text-base font-medium group-hover:op-70 transition-opacity">
                {{ post.title }}
              </span>
              <span class="text-xs ml-2 px-1.5 py-0.5 rounded op-50 font-mono"
                :style="{ backgroundColor: 'var(--common-bg)' }"
              >
                {{ post.category }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="archive.length === 0" class="text-center py-16 op-40">
      <div class="text-4xl mb-4">📂</div>
      <p>No posts yet</p>
    </div>
  </div>
</template>
