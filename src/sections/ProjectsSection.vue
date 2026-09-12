<script setup lang="ts">
import ProjectCard from '../components/projects/ProjectCard.vue'
import { projects } from '../data/projects'
</script>

<template>
  <section id="projetos" class="projects" aria-labelledby="projects-title">
    <div class="projects__container">
      <header class="projects__heading">
        <p class="projects__eyebrow">Trabalho selecionado</p>
        <h2 id="projects-title">Projetos</h2>
        <p>Produtos, aplicações e experiências construídas para resolver problemas reais.</p>
      </header>

      <div class="projects__grid">
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects {
  position: relative;
  padding-block: clamp(5rem, 10vw, 8rem);
  overflow: hidden;
  border-top: 1px solid var(--color-border);
  background:
    radial-gradient(circle at 85% 18%, rgb(var(--color-primary-rgb) / 5%), transparent 24rem),
    var(--color-background);
}

.projects__container {
  width: min(100% - (2 * var(--space-5)), var(--container-max-width));
  margin-inline: auto;
}

.projects__heading {
  max-width: 43rem;
}

.projects__eyebrow {
  color: var(--color-primary);
  font-size: 0.8125rem;
  font-weight: 650;
  letter-spacing: 0.075em;
  text-transform: uppercase;
}

.projects__heading h2 {
  margin-top: var(--space-3);
  color: var(--color-text);
  font-size: clamp(2.5rem, 7vw, 4.75rem);
  letter-spacing: -0.055em;
  line-height: 1;
}

.projects__heading > p:last-child {
  margin-top: var(--space-5);
  color: var(--color-text-muted);
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.7;
}

.projects__grid {
  display: grid;
  margin-top: clamp(2.5rem, 6vw, 4rem);
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

@media (max-width: 64rem) {
  .projects__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 42rem) {
  .projects__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 24rem) {
  .projects__container {
    width: min(100% - (2 * var(--space-4)), var(--container-max-width));
  }
}
</style>
