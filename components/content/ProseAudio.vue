<script setup lang="ts">
import { withBase } from 'ufo'
import { computed, ref, onMounted, useRuntimeConfig } from '#imports'

const props = defineProps({
  src: { type: String, required: true },
  title: { type: String, default: '' },
})

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//'))
    return withBase(props.src, useRuntimeConfig().app.baseURL)
  return props.src
})

const loaded = ref(false)
const error = ref(false)
const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!containerRef.value || !('IntersectionObserver' in window)) {
    loaded.value = true
    return
  }
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        loaded.value = true
        observer.disconnect()
      }
    },
    { rootMargin: '200px' },
  )
  observer.observe(containerRef.value as HTMLElement)
})
</script>

<template>
  <div
    ref="containerRef"
    class="audio-wrap"
    :class="{ error }"
  >
    <audio
      v-if="loaded"
      :src="refinedSrc"
      controls
      preload="metadata"
      @error="error = true"
    >
      <a :href="refinedSrc" download>下载音频</a>
    </audio>
    <p v-if="error" class="err">
      音频加载失败 · <a :href="refinedSrc" download>下载文件</a>
    </p>
  </div>
</template>

<style scoped>
.audio-wrap {
  margin: 1.2em auto;
}
.audio-wrap audio {
  display: block;
  width: 100%;
}
.err {
  margin-top: 4px;
  font-size: 0.85em;
  opacity: 0.6;
}
</style>
