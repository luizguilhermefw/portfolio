<script setup lang="ts">
import { computed } from 'vue'

import type { Project } from '../../data/projects'

type ProjectCardVariant = 'primary' | 'secondary' | 'standard'

const props = withDefaults(
  defineProps<{
    project: Project
    variant?: ProjectCardVariant
  }>(),
  {
    variant: 'standard',
  },
)

const visibleTechnologies = computed(() => {
  const limit = props.project.technologyBadgeLimit ?? props.project.technologies.length
  return props.project.technologies.slice(0, limit)
})

const hiddenTechnologies = computed(() => {
  const limit = props.project.technologyBadgeLimit ?? props.project.technologies.length
  return props.project.technologies.slice(limit)
})
</script>

<template>
  <article class="project-card" :class="`project-card--${variant}`">
    <div v-if="project.image" class="project-card__visual">
      <img :src="project.image" :alt="project.imageAlt" loading="lazy" decoding="async" />
    </div>
    <div v-else class="project-card__visual project-card__visual--abstract" aria-hidden="true">
      <span class="project-card__grid"></span>
      <span class="project-card__orbit"></span>
      <span class="project-card__mark">{{ project.id === 'aylaflow' ? 'AF' : 'HL' }}</span>
    </div>

    <div class="project-card__content">
      <div class="project-card__heading">
        <p v-if="variant !== 'standard'" class="project-card__status">
          {{ variant === 'primary' ? 'Projeto principal' : 'Em destaque' }}
        </p>
        <p class="project-card__category">{{ project.category }}</p>
        <h3>{{ project.name }}</h3>
      </div>

      <p class="project-card__description">{{ project.description }}</p>

      <ul class="project-card__technologies" aria-label="Tecnologias utilizadas">
        <li v-for="technology in visibleTechnologies" :key="technology">{{ technology }}</li>
        <li
          v-if="hiddenTechnologies.length"
          class="project-card__technology-more"
          :aria-label="`Outras tecnologias: ${hiddenTechnologies.join(', ')}`"
        >
          +{{ hiddenTechnologies.length }}
        </li>
      </ul>

      <div v-if="project.links.length" class="project-card__links">
        <a
          v-for="link in project.links"
          :key="link.url"
          class="project-card__link"
          :class="`project-card__link--${link.kind}`"
          :href="link.url"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener noreferrer' : undefined"
        >
          {{ link.label }}
          <span v-if="link.external" aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  display: flex;
  height: 34rem;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: linear-gradient(145deg, var(--color-surface), var(--color-background-elevated));
  flex-direction: column;
  box-shadow: 0 1.25rem 3.5rem rgb(0 4 14 / 14%);
  transition:
    border-color var(--transition-fast),
    transform var(--transition-fast);
}

.project-card:hover {
  border-color: var(--color-border-strong);
  transform: translateY(-2px);
}

.project-card--primary {
  border-color: rgb(var(--color-primary-rgb) / 24%);
  background:
    linear-gradient(145deg, rgb(var(--color-primary-rgb) / 5%), transparent 48%),
    linear-gradient(145deg, var(--color-surface), var(--color-background-elevated));
}

.project-card__visual {
  position: relative;
  height: 12rem;
  min-height: 12rem;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
  flex: 0 0 12rem;
}

.project-card__visual img {
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: cover;
  object-position: top center;
  transition: opacity var(--transition-fast);
}

.project-card:hover .project-card__visual img {
  opacity: 0.92;
}

.project-card__visual--abstract {
  isolation: isolate;
  background:
    radial-gradient(circle at 72% 42%, rgb(var(--color-primary-rgb) / 15%), transparent 7rem),
    linear-gradient(145deg, #061327, #020817);
}

.project-card__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--color-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
  background-size: 2rem 2rem;
  mask-image: linear-gradient(135deg, black, transparent 75%);
  opacity: 0.55;
}

.project-card__orbit {
  position: absolute;
  top: 50%;
  right: 12%;
  width: 9rem;
  height: 4rem;
  border: 1px solid rgb(var(--color-primary-rgb) / 24%);
  border-radius: 50%;
  transform: translateY(-50%) rotate(-18deg);
}

.project-card__orbit::after {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 2rem rgb(var(--color-primary-rgb) / 30%);
  content: '';
  transform: translate(-50%, -50%);
}

.project-card__mark {
  position: absolute;
  bottom: var(--space-5);
  left: var(--space-5);
  color: rgb(244 247 251 / 72%);
  font-size: clamp(2.25rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.06em;
}

.project-card__content {
  display: flex;
  padding: var(--space-5);
  flex: 1;
  flex-direction: column;
}

.project-card__status,
.project-card__category {
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.055em;
  text-transform: uppercase;
}

.project-card__status {
  margin-bottom: var(--space-2);
  color: var(--color-primary);
}

.project-card__category {
  color: var(--color-text-subtle);
}

.project-card h3 {
  margin-top: var(--space-2);
  color: var(--color-text);
  font-size: clamp(1.25rem, 2vw, 1.65rem);
  letter-spacing: -0.035em;
  line-height: 1.15;
}

.project-card__description {
  margin-top: var(--space-3);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
}

.project-card__technologies {
  display: flex;
  margin-top: var(--space-4);
  flex-wrap: wrap;
  gap: var(--space-2);
}

.project-card__technologies li {
  padding: 0.3rem 0.55rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-soft);
  color: var(--color-text-muted);
  font-size: 0.6875rem;
  line-height: 1;
}

.project-card__technologies .project-card__technology-more {
  color: var(--color-primary);
}

.project-card__links {
  display: flex;
  margin-top: auto;
  padding-top: var(--space-4);
  flex-wrap: wrap;
  gap: var(--space-2);
}

.project-card__link {
  display: inline-flex;
  min-height: 2.5rem;
  padding-inline: var(--space-3);
  align-items: center;
  gap: var(--space-2);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: 0.8125rem;
  font-weight: 650;
  text-decoration: none;
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.project-card__link:hover {
  border-color: rgb(var(--color-primary-rgb) / 45%);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.project-card__link--live {
  border-color: transparent;
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.project-card__link--live:hover {
  background: var(--color-primary-hover);
  color: var(--color-on-primary);
}

@media (max-width: 48rem) {
  .project-card {
    height: auto;
  }

  .project-card__content {
    padding: var(--space-5);
  }
}
</style>
