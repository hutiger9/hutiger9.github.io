<script setup lang="ts">
import { getIncludedYearPosts } from '@/utils'

const allPosts = await getIncludedYearPosts('blog')

// All content for global search
const allDocs = await queryContent().sort({ date: -1 }).find()
const searchablePosts = allDocs.filter((p: any) =>
  p.title && p.date && !p._file?.match(/(readme|about|404)\.md$/i)
)

const displayedPosts = ref<any[]>(allPosts)

function onFilter(filtered: any[]) {
  // When search is cleared, SearchBar emits the full list → restore category view
  if (filtered.length === searchablePosts.length) {
    displayedPosts.value = allPosts
  } else {
    displayedPosts.value = filtered
  }
}

onMounted(() => {
  if (!document.getElementById('busuanzi-script')) {
    const script = document.createElement('script')
    script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
    script.async = true
    script.id = 'busuanzi-script'
    document.body.appendChild(script)
  }
})
</script>

<template>
  <SearchBar :posts="searchablePosts" @filter="onFilter" />
  <sub-nav />
  <post-list :posts="displayedPosts" />
  <div style="margin-top: 6rem;" />
  <div id="busuanzi-container" style="text-align: center; margin-top: 2rem; color: #888;">
    <span id="busuanzi_container_site_uv">
      <span id="busuanzi_value_site_uv" /> 访客
    </span>
    &nbsp;&nbsp;
    <span id="busuanzi_container_site_pv">
      <span id="busuanzi_value_site_pv" /> 访问
    </span>
  </div>
</template>
