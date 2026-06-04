<script lang="ts">
import { useClipboard } from '@vueuse/core'
import { defineComponent } from '#imports'

export default defineComponent({
  props: {
    code: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: null,
    },
    filename: {
      type: String,
      default: null,
    },
    highlights: {
      type: Array as () => number[],
      default: () => [],
    },
    meta: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const { copy, isSupported } = useClipboard({ legacy: true })
    const copied = ref(false)
    function copyCode() {
      copy(props.code)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 1000)
    }
    return {
      isSupported,
      copyCode,
      copied,
    }
  },

})
</script>

<template>
  <div class="code-wrap">
    <!-- Header: filename + language badge + copy -->
    <div class="flex items-center justify-between px-4 py-1.5 text-xs rounded-t-lg"
      style="background-color:var(--common-bg); border-bottom:1px solid var(--c-border)"
    >
      <div class="flex items-center gap-2 op-60">
        <!-- Dot indicators -->
        <span class="flex gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full" style="background-color:#ff5f56" />
          <span class="w-2.5 h-2.5 rounded-full" style="background-color:#ffbd2e" />
          <span class="w-2.5 h-2.5 rounded-full" style="background-color:#27c93f" />
        </span>
        <span v-if="filename" class="font-mono op-70">{{ filename }}</span>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="language" class="uppercase op-40 font-mono tracking-wider">{{ language }}</span>
        <button v-if="isSupported" class="hover op-60" title="Copy code">
          <div v-if="copied" class="i-icon-park-outline-check" style="color:var(--accent)" />
          <div v-else class="i-icon-park-outline-copy" @click="copyCode()" />
        </button>
      </div>
    </div>
    <slot />
  </div>
</template>
