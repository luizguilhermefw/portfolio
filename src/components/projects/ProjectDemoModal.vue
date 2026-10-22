<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { Project } from '../../data/projects'

defineProps<{ demo: NonNullable<Project['demo']>; projectId: string }>()

const dialog = ref<HTMLDialogElement | null>(null)
const isOpen = ref(false)
let trigger: HTMLElement | null = null
let previousOverflow = ''

function open() {
  if (!dialog.value || isOpen.value) return
  trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
  dialog.value.showModal()
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  isOpen.value = true
}

function restore() {
  if (!isOpen.value) return
  isOpen.value = false
  document.body.style.overflow = previousOverflow
  if (trigger?.isConnected) trigger.focus({ preventScroll: true })
}

function close() {
  dialog.value?.close()
  restore()
}

onBeforeUnmount(restore)
defineExpose({ open })
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="project-demo"
      :aria-labelledby="`project-demo-${projectId}`"
      @cancel.prevent="close"
      @close="restore"
    >
      <header class="project-demo__header">
        <h2 :id="`project-demo-${projectId}`">{{ demo.title }}</h2>
        <button
          type="button"
          class="project-demo__close"
          aria-label="Fechar demonstração"
          autofocus
          @click="close"
        >
          <span aria-hidden="true">×</span>
        </button>
      </header>
      <div class="project-demo__body">
        <div class="project-demo__player" :class="{ 'project-demo__player--vertical': demo.aspectRatio === '9:16' }">
          <iframe
            v-if="isOpen"
            :src="`https://www.youtube-nocookie.com/embed/${demo.videoId}`"
            :title="demo.title"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.project-demo {
  width: min(56rem, calc(100% - 2rem));
  max-width: none;
  max-height: calc(100dvh - 2rem);
  margin: auto;
  padding: 0;
  overflow: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: 0 1.5rem 5rem rgb(0 0 0 / 35%);
}

.project-demo::backdrop {
  background: rgb(0 4 14 / 80%);
}

.project-demo__header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  padding: var(--space-4);
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.project-demo h2 {
  font-size: clamp(1rem, 3vw, 1.5rem);
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.project-demo__close {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text);
  font-size: 1.75rem;
  cursor: pointer;
}

.project-demo__close:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.project-demo__body {
  padding: var(--space-4);
}

.project-demo__player {
  width: min(100%, calc((100dvh - 12rem) * 1.7777778));
  margin-inline: auto;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--color-background);
}

.project-demo__player--vertical {
  width: min(100%, 24rem, calc((100dvh - 12rem) * 0.5625));
  aspect-ratio: 9 / 16;
}

.project-demo__player iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
