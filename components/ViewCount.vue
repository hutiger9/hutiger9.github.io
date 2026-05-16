<script setup lang="ts">
import { useViewCount } from '@/useViewCount'

const props = defineProps<{ slug: string }>()
const { views, increaseCount } = useViewCount(props.slug)

onMounted(() => {
  increaseCount()
})
</script>

<template>
  <span v-if="views !== null" class="text-xs text-gray-500 ml-2">
    {{ views }} 阅读
  </span>
</template>
