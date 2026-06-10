<script setup lang="ts">
import { getIncludedYearPosts } from '@/utils'

const allPosts = await getIncludedYearPosts('record')

// All content for global search
const allDocs = await queryContent().sort({ date: -1 }).find()
const searchablePosts = allDocs.filter((p: any) =>
  p.title && p.date && !p.translation && !p._file?.match(/(readme|about|404)\.md$/i)
)

const displayedPosts = ref<any[]>(allPosts)

function onFilter(filtered: any[]) {
  if (filtered.length === searchablePosts.length) {
    displayedPosts.value = allPosts
  } else {
    displayedPosts.value = filtered
  }
}
</script>

<template>
  <SearchBar :posts="searchablePosts" @filter="onFilter" />
  <sub-nav />
  <post-list :posts="displayedPosts" />
</template>
