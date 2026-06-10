import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts, transformerVariantGroup } from 'unocss'
import { navLinks, socialLinks, projectList } from './site.config'

const compoundLinks = [...navLinks, ...socialLinks]
const safeNavIcon = compoundLinks.map(link => link.icon)
// Extract project icons for safelist
const projectIcons = projectList.flatMap(s => s.content).map(p => (p as any).icon).filter(Boolean)

export default defineConfig({
  // ...UnoCSS options
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'text-title': 'text-xl sm:text-3xl',
    'hover': 'op-70 hover:op-100 cursor-pointer transition-opacity',
    'deep-hover': 'op-20 hover:op-70 cursor-pointer transition-opacity',
    'bd': 'border-gray-500 border-1',
    'text-deep': 'c-black dark:c-white',
  },
  theme: {
    colors: {
      primary: 'var(--primary)',
      container: 'var(--c-bg)',
    },
    extend: {
      borderRadius: {
        common: 'var(--common-rd)',
      },
    },
  },
  presets: [
    presetUno({
      dark: 'class',
    }),
    presetWebFonts({
      provider: 'none',
      fonts: {
        sans: ['Inter', 'Noto Sans Simplified Chinese'],
        mono: ['Fira Mono', 'Source Code Pro', 'ui-monospace', 'monospace'],
        hand: ['Dancing Script'],
      },
    }),
    presetAttributify (),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
        'width': '1.2em',
        'height': '1.2em',
      },
    }),
  ],
  safelist: [...safeNavIcon, ...projectIcons],
  transformers: [
    transformerVariantGroup(),
  ],
})
