<script setup lang="ts">
import { projectList } from '@/site.config'
import { onMounted, ref } from 'vue'

const lang = ref<'zh' | 'en'>(
  import.meta.client && localStorage.getItem('blog-lang') === 'en' ? 'en' : 'zh'
)

function switchLang(l: 'zh' | 'en') {
  lang.value = l
  if (import.meta.client) localStorage.setItem('blog-lang', l)
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
  <div class="prose">
    <div class="flex justify-end mb-4 lang-switcher">
      <span
        class="lang-link"
        :class="{ active: lang === 'zh' }"
        @click="switchLang('zh')"
      >中文</span>
      <span class="lang-sep">/</span>
      <span
        class="lang-link"
        :class="{ active: lang === 'en' }"
        @click="switchLang('en')"
      >EN</span>
    </div>

    <h1 class="text-title mb-2em font-bold text-center">
      Links
    </h1>

    <div v-if="lang === 'zh'">
      <p>欢迎来到我的友链页面！这里是一些我常访问的博客和网站。</p>
      <h2>添加友链</h2>
      <p>如果你想添加友链，请按以下步骤操作：</p>
      <ul>
        <li>确保你的网站已经添加了我的链接</li>
        <li>通过邮件联系我，并提供以下信息：
          <ul>
            <li>博客名称</li>
            <li>博客网址</li>
            <li>头像链接</li>
            <li>简短描述（可选）</li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Welcome to my friendship links page! Here are some blogs and websites I frequently visit.</p>
      <h2>Add a Link</h2>
      <p>If you'd like to add your link, please follow these steps:</p>
      <ul>
        <li>Make sure your website has already added my link</li>
        <li>Contact me via email and provide the following information:
          <ul>
            <li>Blog Name</li>
            <li>Blog URL</li>
            <li>Avatar URL</li>
            <li>Short Description (optional)</li>
          </ul>
        </li>
      </ul>
    </div>
    
    <article v-for="(series, index) in projectList" :key="index" slide-enter :style="{ '--stagger': index + 1 }">
      <div v-if="series.name" class="text-center mt-2em mb-1em text-gray-700:60 font-bold text-lg">
        {{ series.name }}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-1em">
        <a
          v-for="(project) in series.content" :key="project.path" :title="project.name" :href="project.path"
          target="_blank" class="flex items-center py-0.5em px-1em rounded-sm hover:bg-gray-400:10"
        >
          <div class="hover w-full flex items-center">
            <!-- Avatar (friends) or Icon (projects) -->
            <img v-if="'avatar' in project" :src="(project as any).avatar" :alt="project.name"
              class="w-14 h-14 rounded-full object-cover mr-4 shrink-0 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors dark:hover:border-blue-600" />
            <div v-else class="w-14 h-14 rounded-full mr-4 shrink-0 flex items-center justify-center text-2xl"
              :style="{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }"
            >
              <div :class="(project as any).icon" />
            </div>
            <div>
              <div class="text-lg flex items-center">
                {{ project.name }}
                <span class="text-sm op-50 i-icon-park-outline-efferent-three ml-2" />
              </div>
              <div class="text-sm op-70">{{ project.desc }}</div>
            </div>
          </div>
        </a>
      </div>
    </article>

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
