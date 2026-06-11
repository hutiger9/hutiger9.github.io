<script setup lang="ts">
import { ref, computed } from 'vue'

// ── Scan images from public/images/photos/ using import.meta.glob ──
const imageModules = import.meta.glob('/public/images/photos/**/*.{jpg,jpeg,png,gif,webp,svg,bmp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

interface Photo {
  src: string
  title: string
}

// Convert glob result to photo array
const photos = computed<Photo[]>(() => {
  return Object.entries(imageModules).map(([filePath, url]) => {
    const src = (url as string) || filePath.replace('/public', '')
    const fileName = filePath.split('/').pop() || ''
    const nameNoExt = fileName.replace(/\.[^.]+$/, '')
    return { src, title: nameNoExt }
  })
})

// ── Style toggle ──
const styleMode = ref<'uniform' | 'original'>('uniform')

function toggleStyle() {
  styleMode.value = styleMode.value === 'uniform' ? 'original' : 'uniform'
}

// ── Lightbox ──
const lightboxIndex = ref<number | null>(null)
const lightboxImages = computed(() => photos.value.map(p => p.src))
</script>

<template>
  <section class="slide-enter-content">
    <!-- Style toggle -->
    <div class="flex justify-end mb-4">
      <button
        class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 op-40 hover:op-70"
        :style="{ border: '1px solid var(--c-border)' }"
        @click="toggleStyle"
        :title="styleMode === 'uniform' ? '原始大小' : '统一尺寸'"
      >
        <i :class="styleMode === 'uniform' ? 'i-icon-park-outline-full-screen-one' : 'i-icon-park-outline-grid-four'" />
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="photos.length === 0" class="text-center py-20 op-50">
      <div class="text-5xl mb-4">🖼️</div>
      <p>还没有照片</p>
    </div>

    <!-- Photo Grid -->
    <!-- Original mode: flex wrap, natural aspect ratios, centered -->
    <div
      v-else-if="styleMode === 'original'"
      class="flex flex-wrap gap-3 items-center justify-center"
    >
      <div
        v-for="(photo, idx) in photos"
        :key="idx"
        class="w-[calc(33.33%-0.5rem)] sm:w-[calc(33.33%-0.5rem)] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
        @click="lightboxIndex = idx"
      >
        <img
          :src="photo.src"
          :alt="photo.title"
          class="w-full h-auto block"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Uniform mode: CSS grid, fixed aspect, cropped to fill -->
    <div
      v-else
      class="grid grid-cols-3 gap-2"
    >
      <div
        v-for="(photo, idx) in photos"
        :key="idx"
        class="aspect-square rounded-lg overflow-hidden group relative cursor-pointer transition-all duration-200 hover:scale-[1.02]"
        :style="{ backgroundColor: 'var(--c-bg-card)', border: '1px solid var(--c-border)' }"
        @click="lightboxIndex = idx"
      >
        <img
          :src="photo.src"
          :alt="photo.title"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Lightbox -->
    <ImageLightbox :images="lightboxImages" v-model="lightboxIndex" />
  </section>
</template>
