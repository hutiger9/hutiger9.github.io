<script setup lang="ts">
const { data: stats } = await useAsyncData('home-stats', async () => {
  const allPosts = await queryContent().sort({ date: -1 }).find()
  const posts = allPosts.filter(i => i.title && i.date && !i._file?.match(/(readme|about|404)\.md$/i))
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
        <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-soft)]">
          <span class="text-xl font-bold" style="color:var(--accent)">{{ stats?.postCount || 0 }}</span>
          <span class="text-sm op-60">Articles</span>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-soft)]">
          <span class="text-xl font-bold" style="color:var(--accent)">{{ stats?.tagCount || 0 }}</span>
          <span class="text-sm op-60">Tags</span>
        </div>
      </div>

      <!-- CTA -->
      <div class="flex flex-wrap gap-3 mt-8">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300"
          style="background-color:var(--accent);color:#fff"
        >
          Read Blog
          <i class="i-icon-park-outline-right-small" />
        </NuxtLink>
        <NuxtLink
          to="/links"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300"
          :style="{ border: '1px solid var(--c-border)', color: 'var(--primary)' }"
        >
          About Me
        </NuxtLink>
      </div>
    </section>

    <!-- Divider -->
    <div class="flex items-center gap-4 mb-10 op-30">
      <div class="h-px flex-1" style="background-color:var(--c-border)" />
      <span class="text-sm">About</span>
      <div class="h-px flex-1" style="background-color:var(--c-border)" />
    </div>

    <!-- Original About Content -->
    <section class="prose">
      <ContentDoc path="me" />
    </section>
  </div>
</template>
