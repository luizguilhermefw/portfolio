<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { Project } from '../../data/projects'

defineProps<{ project: Project }>()

const dialog = ref<HTMLDialogElement | null>(null)
let trigger: HTMLElement | null = null
let previousOverflow = ''
let isOpen = false

function open() {
  if (!dialog.value || isOpen) return
  trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
  dialog.value.showModal()
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  isOpen = true
}

function restore() {
  if (!isOpen) return
  document.body.style.overflow = previousOverflow
  isOpen = false
  if (trigger?.isConnected) trigger.focus({ preventScroll: true })
}

onBeforeUnmount(restore)
defineExpose({ open })
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="project-details"
      :aria-labelledby="`project-details-${project.id}`"
      @close="restore"
    >
      <header class="project-details__header">
        <div>
          <p class="project-details__eyebrow">Detalhes técnicos</p>
          <h2 :id="`project-details-${project.id}`">{{ project.name }}</h2>
        </div>
        <button
          type="button"
          class="project-details__close"
          aria-label="Fechar detalhes técnicos"
          autofocus
          @click="dialog?.close()"
        >
          <span aria-hidden="true">×</span>
        </button>
      </header>

      <div class="project-details__body" tabindex="0" aria-label="Conteúdo técnico do projeto">
        <section v-if="project.technologies.length">
          <h3>Tecnologias</h3>
          <ul class="project-details__technologies">
            <li v-for="technology in project.technologies" :key="technology">{{ technology }}</li>
          </ul>
        </section>
        <section v-if="project.technicalHighlights?.length">
          <h3>Implementação</h3>
          <ul class="project-details__list">
            <li v-for="highlight in project.technicalHighlights" :key="highlight">{{ highlight }}</li>
          </ul>
        </section>
        <section v-if="project.securityHighlights?.length">
          <h3>Segurança e privacidade</h3>
          <ul class="project-details__list">
            <li v-for="highlight in project.securityHighlights" :key="highlight">{{ highlight }}</li>
          </ul>
        </section>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.project-details {
  width: min(40rem, calc(100% - 2rem));
  max-width: none;
  max-height: calc(100dvh - 2rem);
  margin: auto;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: 0 1.5rem 5rem rgb(0 0 0 / 35%);
}

.project-details[open] {
  display: flex;
  flex-direction: column;
}

.project-details::backdrop {
  background: rgb(0 4 14 / 80%);
}

.project-details__header {
  display: flex;
  padding: var(--space-5);
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.project-details__eyebrow {
  margin-bottom: var(--space-2);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.055em;
  text-transform: uppercase;
}

.project-details h2 {
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.project-details__close {
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

.project-details__close:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.project-details__body {
  display: grid;
  min-height: 0;
  padding: var(--space-5);
  overflow: auto;
  overscroll-behavior: contain;
  gap: var(--space-5);
  color: var(--color-text-muted);
  font-size: 0.9375rem;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.project-details h3 {
  margin-bottom: var(--space-3);
  color: var(--color-text);
  font-size: 1rem;
}

.project-details__technologies {
  display: flex;
  padding: 0;
  flex-wrap: wrap;
  gap: var(--space-2);
  list-style: none;
}

.project-details__technologies li {
  padding: 0.25rem 0.625rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-primary-soft);
}

.project-details__list {
  display: grid;
  padding-left: 1.25rem;
  gap: var(--space-2);
  list-style: disc;
}
</style>
