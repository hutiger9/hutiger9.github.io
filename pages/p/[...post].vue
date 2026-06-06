<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import { onMounted } from 'vue'

const route = useRoute()
const post = route.params.post as Array<string>
const path = post.join('/')

// SSR-safe scroll progress
const scrollProgress = ref(0)
if (import.meta.client) {
  const { y } = useScroll(window)
  watchEffect(() => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    if (docHeight > 0) {
      scrollProgress.value = Math.min(100, Math.round((y.value / docHeight) * 100))
    }
  })
}

// Reading progress circle
const CIRCUMFERENCE = 2 * Math.PI * 22 // ~138.2
const showCircle = ref(false)
watchEffect(() => {
  showCircle.value = scrollProgress.value > 5
})
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Waline comment system (client-side only)
if (import.meta.client) {
  onMounted(async () => {
    await import('@waline/client/style')
    const { init } = await import('@waline/client')
    init({
      el: '#waline',
      serverURL: 'https://comments.hutiger.men',
      lang: 'zh-CN',
      emoji: true,
      noCopyright: true,
    })
  })
}
</script>

<template>
  <!-- Reading progress bar -->
  <div
    class="fixed top-0 left-0 h-0.5 z-50 transition-all duration-150"
    :style="{
      width: scrollProgress + '%',
      backgroundImage: 'var(--accent-gradient)',
    }"
  />

  <!-- Reading progress circle (bottom-right) -->
  <Transition name="circle-fade">
    <button
      v-if="showCircle"
      class="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg cursor-pointer transition-all duration-300 hover:scale-110"
      :style="{ backgroundColor: 'var(--c-bg-card)', border: '1px solid var(--c-border)' }"
      @click="scrollToTop"
      title="回到顶部"
    >
      <svg viewBox="0 0 48 48" class="w-full h-full -rotate-90 absolute">
        <!-- background circle -->
        <circle cx="24" cy="24" r="22" fill="none" stroke="var(--c-border)" stroke-width="3" opacity="0.3" />
        <!-- progress circle -->
        <circle
          cx="24" cy="24" r="22" fill="none" stroke="var(--accent)" stroke-width="3"
          stroke-linecap="round"
          :stroke-dasharray="CIRCUMFERENCE"
          :stroke-dashoffset="CIRCUMFERENCE - (scrollProgress / 100) * CIRCUMFERENCE"
        />
      </svg>
      <span class="text-xs font-mono font-bold" style="color:var(--accent)">
        {{ scrollProgress }}
      </span>
    </button>
  </Transition>

  <section class="prose relative slide-enter-content">
    <ContentDoc :path="path">
      <template #default="{ doc }">
        <doc-back />
        <doc-render v-if="doc" :article="doc" />
        <doc-toc v-if="doc && doc.body" :toc="doc.body.toc" />
        <!-- Waline 评论系统 -->
        <div class="comment-section">
          <div class="comment-divider">
            <span class="comment-divider-line" />
            <span class="comment-divider-text">💬 评论区</span>
            <span class="comment-divider-line" />
          </div>
          <div class="comment-card">
            <div id="waline" />
          </div>
        </div>
      </template>

      <template #empty>
        <h1 class="text-center">
          Document is empty😅
        </h1>
      </template>

      <template #not-found>
        <h1 class="text-center">
          Not Found Any Document😗
        </h1>
      </template>
    </ContentDoc>
  </section>
</template>
