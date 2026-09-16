<script setup lang="ts">
import { withBase } from 'ufo'
import { computed, ref, onMounted, useRuntimeConfig } from '#imports'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  poster: {
    type: String,
    default: '',
  },
  controls: {
    type: Boolean,
    default: true,
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  loop: {
    type: Boolean,
    default: false,
  },
  muted: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [String, Number],
    default: '100%',
  },
  maxWidth: {
    type: String,
    default: '720px',
  },
})

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//'))
    return withBase(props.src, useRuntimeConfig().app.baseURL)
  return props.src
})

const posterSrc = computed(() => {
  if (!props.poster) return ''
  if (props.poster?.startsWith('/') && !props.poster.startsWith('//'))
    return withBase(props.poster, useRuntimeConfig().app.baseURL)
  return props.poster
})

const error = ref(false)
const loaded = ref(false)
const containerRef = ref<HTMLElement | null>(null)

/**
 * 懒加载：仅在视频进入视口时才真正加载 src
 * 避免页面初始加载时发起大量媒体请求
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
    { rootMargin: '200px' }, // 进入视口前 200px 开始加载
  )
  observer.observe(containerRef.value)
})
</script>

<template>
  <figure ref="containerRef" class="video-wrap" :style="{ maxWidth }">
    <figcaption v-if="title" class="video-title">{{ title }}</figcaption>
    <div class="video-container">
      <!-- 懒加载：loaded 为 true 才渲染 video 元素 -->
      <video
        v-if="loaded"
        :src="refinedSrc"
        :poster="posterSrc || undefined"
        :controls="controls"
        :autoplay="autoplay"
        :loop="loop"
        :muted="muted"
        :width="width"
        preload="metadata"
        class="video-player"
        @error="error = true"
      >
        您的浏览器不支持视频播放，
        <a :href="refinedSrc" download>下载视频文件</a>
      </video>
      <!-- 未进入视口时显示占位 -->
      <div v-else class="video-placeholder">
        <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <span v-if="title" class="placeholder-text">{{ title }}</span>
      </div>
    </div>
    <p v-if="error" class="media-error">
      ⚠️ 视频加载失败
    </p>
  </figure>
</template>

<style scoped>
.video-wrap {
  margin: 2em auto;
  text-align: center;
}
.video-title {
  margin-bottom: 0.5em;
  font-size: 0.9em;
  font-weight: 600;
  opacity: 0.7;
}
.video-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.video-player {
  display: block;
  max-width: 100%;
}
.video-placeholder {
  aspect-ratio: 16 / 9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  background: var(--c-bg-card, #f5f5f5);
  color: var(--c-text-light, #999);
}
.play-icon {
  width: 48px;
  height: 48px;
  opacity: 0.4;
}
.placeholder-text {
  font-size: 0.85em;
  opacity: 0.5;
}
.media-error {
  color: #e74c3c;
  font-size: 0.85em;
  margin-top: 0.4em;
  opacity: 0.8;
}
</style>
