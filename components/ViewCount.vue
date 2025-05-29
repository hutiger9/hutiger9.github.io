<!-- components/ViewCount.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ slug: string }>()
const views = ref<number | null>(null)

onMounted(async () => {
  const namespace = 'your-blog'
  const key = encodeURIComponent(props.slug)

  try {
    const res = await fetch(`https://api.countapi.xyz/get/${namespace}/${key}`)
    const json = await res.json()
    views.value = json?.value ?? null
  } catch (e) {
    console.warn('📉 ViewCount 获取失败', e)
  }
})
</script>

<template>
  <span v-if="views !== null" class="text-xs text-gray-500 ml-2">
    👁️ {{ views }}
  </span>
</template>