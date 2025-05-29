<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ slug: string }>()
const views = ref<number>(0)

onMounted(async () => {
  try {
    const namespace = 'hutiger9.github.io'
    const key = encodeURIComponent(props.slug)
    const res = await fetch(`https://api.countapi.xyz/get/${namespace}/${key}`)
    const json = await res.json()
    views.value = json.value ?? 0
  } catch (e) {
    console.warn('读取 ViewCount 失败，使用默认值 0')
    views.value = 0
  }
})
</script>


<template>
    <span v-if="views !== null" class="text-sm op-60 ml-2 flex items-center gap-1">
      <span class="i-ic-round-remove-red-eye w-4 h-4" />
      {{ views }}
    </span>
  </template>