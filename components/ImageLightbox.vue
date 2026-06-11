<script setup lang="ts">
const props = defineProps<{
  images: string[]
  modelValue: number | null
}>()
const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const isOpen = computed(() => props.modelValue !== null)
const currentIndex = computed(() => props.modelValue ?? 0)

function close() {
  emit('update:modelValue', null)
}
function prev() {
  if (props.modelValue !== null && props.modelValue > 0) {
    emit('update:modelValue', props.modelValue - 1)
  }
}
function next() {
  if (props.modelValue !== null && props.modelValue < props.images.length - 1) {
    emit('update:modelValue', props.modelValue + 1)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/85 flex items-center justify-center select-none"
        @click.self="close"
      >
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white/80 hover:text-white hover:bg-black/50 transition-all text-xl"
          @click="close"
          title="关闭"
        >
          ✕
        </button>

        <!-- Prev button -->
        <button
          v-if="currentIndex > 0"
          class="absolute left-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 text-white/80 hover:text-white hover:bg-black/50 transition-all text-3xl"
          @click="prev"
          title="上一张"
        >
          ‹
        </button>

        <!-- Image -->
        <img
          :key="currentIndex"
          :src="images[currentIndex]"
          class="max-w-[92vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          @click="next"
        />

        <!-- Next button -->
        <button
          v-if="currentIndex < images.length - 1"
          class="absolute right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 text-white/80 hover:text-white hover:bg-black/50 transition-all text-3xl"
          @click="next"
          title="下一张"
        >
          ›
        </button>

        <!-- Counter -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/40 text-white/80 text-sm font-mono">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
