<script setup lang="ts">
import { ref, onMounted } from '#imports'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Embedded video',
  },
  /** 宽高比，默认 16:9 */
  ratio: {
    type: String,
    default: '56.25%',
  },
})

const loaded = ref(false)
const containerRef = ref<HTMLElement | null>(null)

/**
 * 懒加载：iframe 仅在进入视口时才渲染
 * 避免页面初始加载时发起大量网络请求
 */
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
    { rootMargin: '300px' },
  )
  observer.observe(containerRef.value)
})
</script>

<template>
  <figure ref="containerRef" class="embed-wrap">
    <figcaption v-if="title" class="embed-title">{{ title }}</figcaption>
    <div class="embed-container" :style="{ paddingBottom: ratio }">
      <iframe
        v-if="loaded"
        :src="src"
        :title="title"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
      />
      <div v-else class="embed-placeholder">
        <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.embed-wrap {
  margin: 2em auto;
  max-width: 720px;
}
.embed-title {
  margin-bottom: 0.5em;
  font-size: 0.9em;
  font-weight: 600;
  text-align: center;
  opacity: 0.7;
}
.embed-container {
  position: relative;
  width: 100%;
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.embed-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.embed-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-bg-card, #f5f5f5);
}
.embed-placeholder .play-icon {
  width: 56px;
  height: 56px;
  opacity: 0.3;
}
</style>
