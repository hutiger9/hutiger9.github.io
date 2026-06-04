<script setup lang="ts">
import Giscus from '@giscus/vue'
import { useScroll } from '@vueuse/core'

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

  <section class="prose relative slide-enter-content">
    <ContentDoc :path="path">
      <template #default="{ doc }">
        <doc-back />
        <doc-render v-if="doc" :article="doc" />
        <doc-toc v-if="doc && doc.body" :toc="doc.body.toc" />
        <!-- config your giscus -->
        <Giscus
          repo="hutiger9/hutiger9.github.io"
          repo-id="R_kgDOOyDTaA"
          category-id="DIC_kwDOOyDTaM4Cqt1M"
          category="Announcements"
          mapping="title" term="Welcome to my blog!" reactions-enabled="1"
          emit-metadata="1" input-position="top" theme="light_tritanopia" lang="zh-CN" loading="lazy"
        />
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
