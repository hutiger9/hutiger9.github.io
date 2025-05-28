<script setup lang="ts">
import { projectList } from '@/site.config'
</script>

<template>
  <div class="prose">
    <h1 class="text-title mb-2em font-bold text-center">
      Friends link
    </h1>
  <div>
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
      <div class="text-center mt-2em mb-1em text-gray-700:60" font-bold text-lg>
        {{ series.name }}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-1em">
        <a
          v-for="(project) in series.content" :key="project.path" :title="project.name" :href="project.path"
          target="_blank" class="flex items-center py-0.5em px-1em rounded-sm hover:bg-gray-400:10"
        >
        <div class="hover w-full flex items-center">
  <img :src="project.avatar" alt="project.name"
    class="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors dark:hover:border-blue-600" />
  
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
  </div>
</template>
