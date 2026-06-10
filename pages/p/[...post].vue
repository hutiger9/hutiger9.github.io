<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import { onMounted, computed, ref } from 'vue'
import { queryContent } from '#imports'

const route = useRoute()
const post = route.params.post as Array<string>
const basePath = post.join('/')

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

// ── Share ──
const linkCopied = ref(false)
const canShareNative = ref(false)
if (import.meta.client) {
  canShareNative.value = !!navigator?.share
}
const pageUrl = computed(() => {
  if (import.meta.client) return window.location.href
  return ''
})
const pageTitle = computed(() => {
  if (import.meta.client) return document.title
  return ''
})

function shareToX() {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle.value)}&url=${encodeURIComponent(pageUrl.value)}`
  window.open(url, '_blank', 'noopener,width=600,height=400')
}

function shareToWeibo() {
  const url = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(pageTitle.value)}&url=${encodeURIComponent(pageUrl.value)}`
  window.open(url, '_blank', 'noopener,width=600,height=500')
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(pageUrl.value)
    linkCopied.value = true
    setTimeout(() => { linkCopied.value = false }, 2000)
  } catch {
    // fallback
    const textarea = document.createElement('textarea')
    textarea.value = pageUrl.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    linkCopied.value = true
    setTimeout(() => { linkCopied.value = false }, 2000)
  }
}

async function shareNative() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: pageTitle.value,
        url: pageUrl.value,
      })
    } catch { /* user cancelled */ }
  }
}

// ── Multi-language support ──
const LANG_LABELS: Record<string, string> = {
  zh: '中文',
  en: 'EN',
  ja: '日本語',
  fr: 'FR',
  de: 'DE',
  es: 'ES',
  ko: 'KO',
  ru: 'RU',
  pt: 'PT',
}

// Detect available versions from the default (zh) doc's frontmatter
const { data: defaultDoc } = await useAsyncData(`meta:${basePath}`, () =>
  queryContent(basePath).only(['versions', 'lang']).findOne()
)

const versions = computed<Record<string, string> | null>(() => defaultDoc.value?.versions ?? null)
const availableLangs = computed<string[]>(() => versions.value ? Object.keys(versions.value) : [])

const activeLang = ref('zh')
const contentPath = computed(() => {
  if (!versions.value) return basePath
  return versions.value[activeLang.value] || basePath
})

function switchLang(lang: string) {
  activeLang.value = lang
  if (import.meta.client) {
    localStorage.setItem('blog-lang', lang)
  }
}

// Auto-detect browser language & switch to matching version (client-side only)
if (import.meta.client) {
  onMounted(() => {
    const saved = localStorage.getItem('blog-lang')
    if (saved && availableLangs.value.includes(saved)) {
      activeLang.value = saved
    } else if (availableLangs.value.length > 1) {
      const browserLang = navigator.language?.split('-')[0] || ''
      if (browserLang !== 'zh' && availableLangs.value.includes(browserLang)) {
        activeLang.value = browserLang
        localStorage.setItem('blog-lang', browserLang)
      }
    }
  })
}

// ── Waline comment system (client-side only) ──
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

    <ContentDoc :path="contentPath">
      <template #default="{ doc }">
        <doc-back />
        <!-- Language switcher -->
        <div v-if="availableLangs.length > 1" class="flex justify-end mb-4">
          <div class="flex gap-1 p-1 rounded-lg"
            :style="{ backgroundColor: 'var(--c-bg-card)', border: '1px solid var(--c-border)' }"
          >
            <button
              v-for="lang in availableLangs"
              :key="lang"
              class="lang-btn"
              :class="{ active: activeLang === lang }"
              @click="switchLang(lang)"
            >
              {{ LANG_LABELS[lang] || lang.toUpperCase() }}
            </button>
          </div>
        </div>
        <doc-render v-if="doc" :article="doc" />
        <doc-toc v-if="doc && doc.body" :toc="doc.body.toc" />

        <!-- 分享按钮 -->
        <div class="share-section">
          <div class="share-divider">
            <span class="comment-divider-line" />
            <span class="comment-divider-text">分享这篇文章</span>
            <span class="comment-divider-line" />
          </div>
          <div class="share-buttons">
            <button class="share-btn" title="分享到 Twitter/X" @click="shareToX">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>X</span>
            </button>
            <button class="share-btn" title="分享到微博" @click="shareToWeibo">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM8.594 11.39c-4.08.528-7.278 3.066-7.15 5.676.127 2.607 3.528 4.313 7.61 3.786 4.079-.527 7.282-3.067 7.152-5.678-.128-2.6-3.528-4.313-7.612-3.784zm3.918-4.035c.253.339.6.533 1.003.539.694.008 1.23-.434 1.219-1.049-.01-.614-.566-1.098-1.26-1.09-.693.007-1.214.502-1.203 1.108.005.186.087.363.24.492z"/>
                <path d="M20.174 5.816a4.105 4.105 0 00-4.147-4.104 4.104 4.104 0 00-4.101 4.152c0 2.262 1.835 4.095 4.101 4.095 2.263 0 4.1-1.833 4.147-4.095v-.048z"/>
              </svg>
              <span>微博</span>
            </button>
            <button class="share-btn" title="复制链接" @click="copyLink">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              <span>复制链接</span>
            </button>
            <button v-if="canShareNative" class="share-btn share-more" title="更多分享方式" @click="shareNative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              <span>分享</span>
            </button>
          </div>
          <p v-if="linkCopied" class="share-toast">✅ 链接已复制到剪贴板</p>
        </div>

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

<style scoped>
.lang-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--c-text, #666);
  background: transparent;
  transition: all 0.2s ease;
  text-align: center;
}

.lang-btn:hover {
  color: var(--accent);
  background-color: color-mix(in srgb, var(--accent) 10%, transparent);
}

.lang-btn.active {
  color: var(--accent);
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* ── Share Section ── */
.share-section {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.share-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.share-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-bg-card);
  color: var(--primary);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-btn:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-1px);
}

.share-toast {
  text-align: center;
  font-size: 0.8rem;
  color: var(--accent);
  margin-top: 0.5rem;
  animation: fadeInOut 2s ease;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-4px); }
  15% { opacity: 1; transform: translateY(0); }
  85% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-4px); }
}
</style>
