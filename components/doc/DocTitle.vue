<script setup lang="ts">
import { formattedDate } from '@/utils'
import { useViewCount } from '@/useViewCount'

const props = defineProps(['article'])
const route = useRoute()
const path = '/' + (route.params.post as string[])?.join('/')
const { views, increaseCount } = useViewCount(path)

onMounted(() => {
  increaseCount()
})
</script>

<template>
  <div>
    <h1>{{ props.article.title }}</h1>
    <div class="op-50 mb-4em">
      <div class="flex items-center gap-4">
        <span class="flex items-center">
          <i class="i-icon-park-outline-calendar m-r-0.5em" /> {{ formattedDate(props.article.date) }}
        </span>
        <span v-if="views !== null" class="flex items-center">
          <i class="i-icon-park-outline-eye m-r-0.3em" /> {{ views }} 阅读
        </span>
      </div>
      <div class="flex gap-2 m-t-0.5em">
        <NuxtLink
          v-for="tag in props.article.tags" :key="tag" :to="`/tags/${tag}`"
        >
          #{{ tag }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
