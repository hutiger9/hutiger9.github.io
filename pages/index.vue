<script setup lang="ts">
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { queryContent } from '#imports'

// ── Multi-language for About section ──
const LANG_LABELS: Record<string, string> = {
  zh: '中文',
  en: 'EN',
}
const { data: aboutMeta } = await useAsyncData('about-meta', () =>
  queryContent('me').only(['versions']).findOne()
)
const versions = computed(() => (aboutMeta.value as any)?.versions ?? null)
const availableLangs = computed<string[]>(() => versions.value ? Object.keys(versions.value) : [])

const savedLang = import.meta.client ? localStorage.getItem('blog-lang') : null
const browserLang = import.meta.client ? (navigator.language?.split('-')[0] || '') : ''
const activeAboutLang = ref<string>(
  savedLang && availableLangs.value.includes(savedLang)
    ? savedLang
    : browserLang !== 'zh' && availableLangs.value.includes(browserLang)
      ? browserLang
      : 'zh'
)
const aboutPath = computed(() => versions.value?.[activeAboutLang.value] || 'me')

function switchAboutLang(lang: string) {
  activeAboutLang.value = lang
  if (import.meta.client) localStorage.setItem('blog-lang', lang)
}

// ── Stats ──
const { data: stats } = await useAsyncData('home-stats', async () => {
  const allPosts = await queryContent().sort({ date: -1 }).find()
  const posts = allPosts.filter(i => i.title && i.date && !i.translation && !i._file?.match(/(readme|about|404)\.md$/i))
  const tags = new Set<string>()
  posts.forEach(p => p.tags?.forEach((t: string) => tags.add(t)))
  return { postCount: posts.length, tagCount: tags.size }
})

const greeting = ref('')
const fullGreeting = '你好，我是'
let charIndex = 0
let isDeleting = false
let timeoutId: ReturnType<typeof setTimeout>

function typeEffect() {
  const target = fullGreeting
  if (!isDeleting) {
    if (charIndex <= target.length) {
      greeting.value = target.slice(0, charIndex)
      charIndex++
      timeoutId = setTimeout(typeEffect, 100)
    } else {
      isDeleting = true
      timeoutId = setTimeout(typeEffect, 2000)
    }
  } else {
    if (charIndex > 0) {
      charIndex--
      greeting.value = target.slice(0, charIndex)
      timeoutId = setTimeout(typeEffect, 40)
    } else {
      isDeleting = false
      timeoutId = setTimeout(typeEffect, 500)
    }
  }
}

onMounted(() => {
  typeEffect()
})

onUnmounted(() => clearTimeout(timeoutId))

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

// ── Image Lightbox for About content ──
const lightboxIndex = ref<number | null>(null)
const aboutImages = ref<string[]>([])

function setupAboutLightbox() {
  nextTick(() => {
    const imgs = document.querySelectorAll('.prose img:not(.no-lightbox)')
    const srcs: string[] = []
    imgs.forEach((img, i) => {
      const src = (img as HTMLImageElement).getAttribute('src') || ''
      srcs.push(src)
      img.classList.add('cursor-pointer', 'transition-opacity', 'hover:op-80')
      img.addEventListener('click', () => {
        lightboxIndex.value = i
      })
    })
    aboutImages.value = srcs
  })
}

watch(aboutPath, () => {
  if (import.meta.client) nextTick(setupAboutLightbox)
})

if (import.meta.client) {
  onMounted(() => {
    setTimeout(setupAboutLightbox, 200)
  })
}
</script>

<template>
  <div class="slide-enter-content">
    <!-- Hero Section -->
    <section class="mb-16 pt-8 md:pt-16">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
        <!-- Avatar -->
        <div class="shrink-0">
          <div class="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[var(--accent)] to-blue-400 p-0.5">
            <div class="w-full h-full rounded-full bg-[var(--c-bg)] flex items-center justify-center text-3xl select-none">
              <img
                  src="/images/meme.jpg"
                  alt="Avatar"
                  class="w-full h-full object-cover rounded-full">
            </div>
          </div>
        </div>

        <!-- Text -->
        <div class="flex-1 min-w-0">
          <h1 class="text-3xl md:text-5xl font-bold leading-tight mb-3">
            <span class="op-50">{{ greeting }}<span class="animate-pulse">|</span></span><br>
            <span class="bg-clip-text text-transparent" style="background-image: var(--accent-gradient);">
              Hutiger
            </span>
          </h1>
          <p class="text-base md:text-lg op-70 max-w-lg leading-relaxed">
            An undergraduate at Shanghai University, sharing life, learning, and late-night ideas.
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div class="flex gap-6 mt-8">
        <div class="flex items-center gap-2">
          <span class="text-xl font-bold" style="color:var(--accent)">{{ stats?.postCount || 0 }}</span>
          <span class="text-sm op-60">Articles</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xl font-bold" style="color:var(--accent)">{{ stats?.tagCount || 0 }}</span>
          <span class="text-sm op-60">Tags</span>
        </div>
      </div>

      <!-- CTA -->
      <div class="flex flex-wrap gap-3 mt-8">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-1 font-medium transition-all duration-300 hover:op-70"
          style="color:var(--accent)"
        >
          Read Blog
          <i class="i-icon-park-outline-right-small" />
        </NuxtLink>
      </div>
    </section>

    <!-- Divider -->
    <div class="flex items-center gap-4 mb-6 op-30">
      <div class="h-px flex-1" style="background-color:var(--c-border)" />
      <span class="text-sm">About</span>
      <div class="h-px flex-1" style="background-color:var(--c-border)" />
    </div>

    <!-- Language switcher for About -->
    <div v-if="availableLangs.length > 1" class="flex justify-end mb-4 lang-switcher">
      <template v-for="(lang, idx) in availableLangs" :key="lang">
        <span v-if="idx > 0" class="lang-sep">/</span>
        <a
          class="lang-link"
          :class="{ active: activeAboutLang === lang }"
          @click="switchAboutLang(lang)"
        >
          {{ LANG_LABELS[lang] || lang.toUpperCase() }}
        </a>
      </template>
    </div>

    <!-- Original About Content -->
    <section class="prose">
      <ContentDoc :path="aboutPath" />
    </section>

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

    <ImageLightbox :images="aboutImages" v-model="lightboxIndex" />
  </div>
</template>

<style scoped>
.lang-switcher {
  align-items: center;
  gap: 0;
  font-size: 0.85rem;
}
.lang-sep {
  margin: 0 6px;
  color: var(--c-text-light, #999);
  opacity: 0.8;
}
.lang-link {
  color: var(--c-text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  cursor: pointer;
}
.lang-link:hover {
  color: var(--accent);
}
.lang-link.active {
  color: var(--c-text);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
