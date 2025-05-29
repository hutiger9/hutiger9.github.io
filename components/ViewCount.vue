<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ slug: string }>()
const views = ref<number>(0)

onMounted(async () => {
  const hasVisited = localStorage.getItem(`viewed-${props.slug}`)
  const namespace = 'hutiger9.github.io'
  const key = encodeURIComponent(props.slug)

  try {
    const url = hasVisited
      ? `https://api.countapi.xyz/get/${namespace}/${key}`
      : `https://api.countapi.xyz/hit/${namespace}/${key}`

    const res = await fetch(url)
    const json = await res.json()
    views.value = json?.value || 0

    if (!hasVisited) {
      localStorage.setItem(`viewed-${props.slug}`, '1')
    }
  } catch (e) {
    console.warn('读取 ViewCount 失败，使用默认值 0')
  }
})
</script>


<template>
    <span v-if="views !== null" class="text-sm op-60 ml-2 flex items-center gap-1">
      <span class="i-ic-round-remove-red-eye w-4 h-4" />
      {{ views }}
    </span>
  </template>