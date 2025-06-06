<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getIncludedYearPosts } from '@/utils'

const posts = await getIncludedYearPosts('life')

const route = useRoute()
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`)
onMounted(async () => {
  const namespace = 'hutiger9.github.io'
  const key = encodeURIComponent(route.path)
  await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
})
</script>

<template>
  <sub-nav />
  <post-list :posts="posts" />
</template>