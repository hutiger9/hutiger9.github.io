<script lang="ts" setup>
import { useScroll } from '@vueuse/core'

const router = useRouter()
const { y } = useScroll(window)
const showFAB = computed(() => y.value > 400)

function goBack() {
  // navigateTo /blog on error / no history
  try {
    router.back()
    // If back didn't work (no history), navigate after a tiny delay
    setTimeout(() => {
      if (window.location.pathname.startsWith('/p/')) {
        navigateTo('/blog', { replace: true })
      }
    }, 100)
  } catch {
    navigateTo('/blog', { replace: true })
  }
}

function backTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <!-- Desktop sidebar -->
  <div class="pr-2em xl:(absolute top-0 right-full h-full)">
    <div class="sticky top-14 w-8em">
      <div class="cursor-pointer hover op-60" @click="goBack">
        <div class="i-icon-park-outline-left-small-up" /> Back
      </div>

      <div class="cursor-pointer hover op-60 mt-3" @click="backTop">
        <div class="i-icon-park-outline-to-top-one" /> To Top
      </div>
    </div>
  </div>

  <!-- Mobile FAB -->
  <Transition name="fab">
    <div
      v-if="showFAB"
      class="fixed bottom-6 right-6 z-40 flex flex-col gap-2 xl:hidden"
    >
      <button
        class="w-11 h-11 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110"
        :style="{ backgroundColor: 'var(--c-bg-card)', border: '1px solid var(--c-border)', color: 'var(--primary)' }"
        title="Back to previous"
        @click="goBack"
      >
        <i class="i-icon-park-outline-left-small-up text-lg" />
      </button>
      <button
        class="w-11 h-11 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110"
        :style="{ backgroundColor: 'var(--accent)', color: '#fff', border: 'none' }"
        title="Back to top"
        @click="backTop"
      >
        <i class="i-icon-park-outline-to-top-one text-lg" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.fab-enter-active,
.fab-leave-active {
  transition: all 0.3s ease;
}
.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
