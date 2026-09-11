<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const navigationItems = [
  { label: 'Início', href: '#inicio' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'AylaFlow', href: '#aylaflow' },
  { label: 'Tecnologias', href: '#tecnologias' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
]

const isMenuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function handleEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !isMenuOpen.value) return

  closeMenu()
  menuButton.value?.focus()
}

onMounted(() => document.addEventListener('keydown', handleEscape))
onBeforeUnmount(() => document.removeEventListener('keydown', handleEscape))
</script>

<template>
  <header class="app-header">
    <div class="app-header__container">
      <a class="brand" href="#inicio" aria-label="LFWeb Studio — início" @click="closeMenu">
        <span class="brand__name">LFWeb</span>
        <span class="brand__suffix">Studio</span>
      </a>

      <button
        ref="menuButton"
        class="menu-toggle"
        type="button"
        :aria-label="isMenuOpen ? 'Fechar menu principal' : 'Abrir menu principal'"
        aria-controls="primary-navigation"
        :aria-expanded="isMenuOpen"
        @click="toggleMenu"
      >
        <span class="menu-toggle__line" aria-hidden="true"></span>
        <span class="menu-toggle__line" aria-hidden="true"></span>
      </button>

      <nav
        id="primary-navigation"
        class="navigation"
        :class="{ 'navigation--open': isMenuOpen }"
        aria-label="Navegação principal"
      >
        <ul class="navigation__list">
          <li v-for="item in navigationItems" :key="item.href">
            <a class="navigation__link" :href="item.href" @click="closeMenu">
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  z-index: 20;
  top: 0;
  height: var(--header-height);
  border-bottom: 1px solid var(--color-border);
  background: rgb(var(--color-background-rgb) / 82%);
  backdrop-filter: blur(12px);
}

.app-header__container {
  position: relative;
  display: flex;
  width: min(100% - (2 * var(--space-5)), var(--container-max-width));
  height: 100%;
  margin-inline: auto;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
}

.brand {
  display: inline-flex;
  align-items: baseline;
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-decoration: none;
}

.brand__suffix {
  margin-left: 0.3rem;
  color: var(--color-primary);
  font-weight: 500;
}

.navigation__list {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.navigation__link {
  display: inline-flex;
  min-height: 2.75rem;
  padding-inline: var(--space-3);
  align-items: center;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast);
}

.navigation__link:hover {
  background: var(--color-surface-soft);
  color: var(--color-text);
}

.menu-toggle {
  display: none;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface-soft);
  color: var(--color-text);
  cursor: pointer;
}

.menu-toggle__line {
  display: block;
  width: 100%;
  height: 1px;
  background: currentColor;
  transition: transform var(--transition-fast);
}

.menu-toggle__line + .menu-toggle__line {
  margin-top: 0.45rem;
}

.menu-toggle[aria-expanded='true'] .menu-toggle__line:first-child {
  transform: translateY(0.225rem) rotate(45deg);
}

.menu-toggle[aria-expanded='true'] .menu-toggle__line:last-child {
  transform: translateY(-0.225rem) rotate(-45deg);
}

@media (max-width: 52rem) {
  .menu-toggle {
    display: block;
  }

  .navigation {
    position: absolute;
    top: calc(100% + var(--space-3));
    right: 0;
    left: 0;
    visibility: hidden;
    padding: var(--space-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-background-elevated);
    box-shadow: var(--shadow-elevated);
    opacity: 0;
    transform: translateY(-0.5rem);
    transition:
      visibility var(--transition-fast),
      opacity var(--transition-fast),
      transform var(--transition-fast);
  }

  .navigation--open {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

  .navigation__list {
    display: grid;
    gap: 0;
  }

  .navigation__link {
    width: 100%;
    min-height: 3rem;
    padding-inline: var(--space-4);
  }
}

@media (max-width: 24rem) {
  .app-header__container {
    width: min(100% - (2 * var(--space-4)), var(--container-max-width));
  }
}
</style>
