<script setup lang="ts">
import { onMounted } from 'vue'

const contentQuery = await queryContent().find()

const tagsContent = contentQuery
  .filter(i => i.tags) // 过滤无tags的选项
  .filter((i) => {
    const regex = /(readme|about)\.md$/i // 匹配 /readme.md 或 /about.md
    return !regex.test(i._file!) // 如果不匹配，则保留该项
  })
  .reduce((counts, post) => {
    for (const tag of post.tags) {
      if (counts[tag])
        counts[tag]++

      else
        counts[tag] = 1
    }
    return counts
  }, {} as { [key: string]: number })

// Waline comment system (client-side only)
if (import.meta.client) {
  onMounted(async () => {
    await import('@waline/client/style')
    const { init } = await import('@waline/client')
    init({
      el: '#waline',
      serverURL: 'https://comments.hutiger.men',
      lang: 'zh-CN',
      emoji: true,
      noCopyright: true,
    })
  })
}
</script>

<template>
  <h1 class="text-title mb-2em font-bold">
    Tags
  </h1>
  <ul class="flex gap-1em flex-wrap">
    <li v-for="(value, key, index) in tagsContent" :key="key" slide-enter :style="{ '--stagger': index + 1 }" class="px-2 bg-gray-400:20 rd-1">
      <NuxtLink :to="`/tags/${key}`" class="flex gap-2">
        <span class="hover">#{{ key }}</span>
        <span>{{ value }}</span>
      </NuxtLink>
    </li>
  </ul>

  <!-- Waline 评论系统 -->
  <div class="comment-section">
    <div class="comment-divider">
      <span class="comment-divider-line" />
      <span class="comment-divider-text">💬 评论区</span>
      <span class="comment-divider-line" />
    </div>
    <div class="comment-card">
      <div id="waline" />
    </div>
  </div>
</template>
