<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const showBackToTop = ref(false)
const actions = ref<HTMLDivElement | null>(null)
const obstructed = ref(false)
let overlapObserver: IntersectionObserver | undefined

function observeOverlap() {
  overlapObserver?.disconnect()
  if (!actions.value) return

  const rect = actions.value.getBoundingClientRect()
  const overlaps = new Set<Element>()
  overlapObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) overlaps.add(entry.target)
        else overlaps.delete(entry.target)
      }
      obstructed.value = overlaps.size > 0
    },
    {
      rootMargin: `-${Math.max(0, rect.top)}px 0px 0px -${Math.max(0, rect.left)}px`,
    },
  )

  document.querySelectorAll('main a, main button, main article, footer').forEach((element) => {
    overlapObserver?.observe(element)
  })
}

function updateScrollPosition() {
  showBackToTop.value = window.scrollY > 500
}

function backToTop() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' })

  // Keep keyboard navigation at the beginning when this button becomes hidden.
  document.querySelector<HTMLAnchorElement>('.app-header a[href="#inicio"]')?.focus({
    preventScroll: true,
  })
}

onMounted(() => {
  updateScrollPosition()
  observeOverlap()
  window.addEventListener('scroll', updateScrollPosition, { passive: true })
  window.addEventListener('resize', observeOverlap)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollPosition)
  window.removeEventListener('resize', observeOverlap)
  overlapObserver?.disconnect()
})
</script>

<template>
  <div ref="actions" class="floating-actions" :class="{ 'floating-actions--obstructed': obstructed }">
    <button
      class="floating-actions__top"
      :class="{ 'floating-actions__top--visible': showBackToTop }"
      :tabindex="showBackToTop ? 0 : -1"
      :aria-hidden="!showBackToTop"
      type="button"
      aria-label="Voltar ao topo"
      @click="backToTop"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="m6 12 6-6 6 6M12 6v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <a
      class="floating-actions__whatsapp"
      href="https://wa.me/5545991335359"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com Luiz pelo WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M20.52 3.48A11.87 11.87 0 0 0 12.05 0C5.45 0 .08 5.37.08 11.97c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.63a11.94 11.94 0 0 0 5.84 1.49h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.24-6.2-3.5-8.41ZM12.05 21.84a9.92 9.92 0 0 1-5.06-1.39l-.36-.21-3.68.97.98-3.59-.23-.37a9.9 9.9 0 0 1-1.52-5.28c0-5.49 4.47-9.96 9.97-9.96a9.88 9.88 0 0 1 7.04 2.92 9.89 9.89 0 0 1 2.91 7.05c0 5.49-4.47 9.96-9.96 9.96Zm5.46-7.46c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.62-.93-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.62.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  </div>
</template>

<style scoped>
.floating-actions {
  position: fixed;
  z-index: 10;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 1rem;
  padding-right: calc(1rem + env(safe-area-inset-right, 0px));
  padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
  align-items: center;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
}

.floating-actions a,
.floating-actions button {
  display: grid;
  padding: 0;
  border: 1px solid var(--color-border-strong);
  border-radius: 50%;
  place-items: center;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 0.25rem 1rem rgb(0 0 0 / 20%);
  transition: background-color var(--transition-fast), opacity var(--transition-fast),
    transform var(--transition-fast), visibility var(--transition-fast);
}

.floating-actions svg {
  width: 1.5rem;
  height: 1.5rem;
}

.floating-actions .floating-actions__top {
  width: 2.75rem;
  height: 2.75rem;
  background: var(--color-background-elevated);
  color: var(--color-primary);
  visibility: hidden;
  opacity: 0;
  transform: translateY(0.5rem);
  pointer-events: none;
}

.floating-actions .floating-actions__top--visible {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.floating-actions__whatsapp {
  width: 3.5rem;
  height: 3.5rem;
  background: #25d366;
  color: #062b16;
}

.floating-actions__top:hover,
.floating-actions__top:focus-visible {
  background: var(--color-surface);
}

.floating-actions__whatsapp:hover,
.floating-actions__whatsapp:focus-visible {
  background: #45df80;
}

.floating-actions :focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

.floating-actions--obstructed:not(:focus-within) > a,
.floating-actions--obstructed:not(:focus-within) > button {
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
}

@media (min-width: 64rem) and (min-height: 31rem) {
  .floating-actions {
    padding-right: calc(1.5rem + env(safe-area-inset-right, 0px));
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
  }

  .floating-actions__whatsapp {
    width: 3.75rem;
    height: 3.75rem;
  }

  .floating-actions .floating-actions__top {
    width: 3rem;
    height: 3rem;
  }
}

@media (max-height: 30rem) {
  .floating-actions {
    gap: 0.5rem;
  }

  .floating-actions__whatsapp {
    width: 3.25rem;
    height: 3.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-actions a,
  .floating-actions button {
    transition: none;
    transform: none;
  }
}
</style>
