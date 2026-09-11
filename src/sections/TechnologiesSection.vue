<script setup lang="ts">
import { technologyGroups } from '../data/technologies'
</script>

<template>
  <section id="tecnologias" class="technologies" aria-labelledby="technologies-title">
    <div class="technologies__container">
      <header class="technologies__heading">
        <p class="technologies__eyebrow">Stack &amp; engenharia</p>
        <h2 id="technologies-title">Tecnologias</h2>
        <p class="technologies__headline">Ferramentas que sustentam os produtos que construo.</p>
        <p class="technologies__intro">
          Uma stack aplicada em produtos, APIs e integrações reais, organizada pelo papel que cada
          tecnologia desempenha na solução.
        </p>
      </header>

      <div class="stack-map">
        <article v-for="(group, index) in technologyGroups" :key="group.id" class="stack-layer">
          <div class="stack-layer__context">
            <span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            <div>
              <h3>{{ group.title }}</h3>
              <p>{{ group.description }}</p>
            </div>
          </div>

          <ul class="stack-layer__items">
            <li
              v-for="item in group.items"
              :key="item.name"
              :class="{ 'stack-layer__item--practice': item.type === 'practice' }"
            >
              {{ item.name }}
              <span v-if="item.type === 'practice'">Prática</span>
            </li>
          </ul>
        </article>
      </div>

      <div class="technologies__legend" aria-label="Legenda dos itens da stack">
        <span><i aria-hidden="true"></i>Tecnologias e ferramentas</span>
        <span><i aria-hidden="true"></i>Práticas arquiteturais</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.technologies {
  position: relative;
  isolation: isolate;
  padding-block: clamp(5rem, 11vw, 9rem);
  overflow: hidden;
  border-top: 1px solid var(--color-border);
  background:
    linear-gradient(90deg, rgb(var(--color-primary-rgb) / 3%), transparent 38%),
    var(--color-background);
}

.technologies::before {
  position: absolute;
  z-index: -1;
  top: 8rem;
  right: -10rem;
  width: 28rem;
  height: 28rem;
  border: 1px solid rgb(var(--color-primary-rgb) / 8%);
  border-radius: 50%;
  content: '';
}

.technologies__container {
  width: min(100% - (2 * var(--space-5)), var(--container-max-width));
  margin-inline: auto;
}

.technologies__heading {
  display: grid;
  grid-template-columns: minmax(0, 0.72fr) minmax(20rem, 1fr);
  column-gap: clamp(3rem, 8vw, 7rem);
}

.technologies__eyebrow {
  grid-column: 1 / -1;
  color: var(--color-primary);
  font-size: 0.8125rem;
  font-weight: 650;
  letter-spacing: 0.075em;
  text-transform: uppercase;
}

.technologies__heading h2 {
  margin-top: var(--space-3);
  color: var(--color-text);
  font-size: clamp(2.75rem, 7vw, 5rem);
  letter-spacing: -0.06em;
  line-height: 1;
}

.technologies__headline {
  max-width: 20ch;
  margin-top: var(--space-5);
  color: var(--color-text);
  font-size: clamp(1.5rem, 3.5vw, 2.5rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.18;
}

.technologies__intro {
  grid-column: 2;
  max-width: 42rem;
  margin-top: var(--space-5);
  color: var(--color-text-muted);
  font-size: 1rem;
  line-height: 1.75;
}

.stack-map {
  margin-top: clamp(3.5rem, 8vw, 6rem);
  border-top: 1px solid var(--color-border-strong);
}

.stack-layer {
  display: grid;
  min-width: 0;
  padding-block: clamp(1.75rem, 4vw, 3rem);
  border-bottom: 1px solid var(--color-border);
  grid-template-columns: minmax(18rem, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(2rem, 7vw, 6rem);
}

.stack-layer__context {
  display: grid;
  min-width: 0;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: var(--space-4);
}

.stack-layer__context > span {
  padding-top: 0.2rem;
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.06em;
}

.stack-layer h3 {
  color: var(--color-text);
  font-size: clamp(1.125rem, 2.2vw, 1.5rem);
  letter-spacing: -0.025em;
  line-height: 1.25;
}

.stack-layer__context p {
  max-width: 34rem;
  margin-top: var(--space-3);
  color: var(--color-text-muted);
  font-size: 0.9375rem;
  line-height: 1.65;
}

.stack-layer__items {
  display: flex;
  align-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.stack-layer__items li {
  display: inline-flex;
  min-height: 2.5rem;
  padding: 0.65rem 0.9rem;
  align-items: center;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-background-elevated);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 550;
  line-height: 1.2;
}

.stack-layer__items .stack-layer__item--practice {
  border-color: rgb(var(--color-primary-rgb) / 24%);
  background: var(--color-primary-soft);
  color: var(--color-primary-hover);
}

.stack-layer__item--practice span {
  margin-left: var(--space-3);
  padding-left: var(--space-3);
  border-left: 1px solid rgb(var(--color-primary-rgb) / 25%);
  color: var(--color-text-subtle);
  font-size: 0.75rem;
  font-weight: 500;
}

.technologies__legend {
  display: flex;
  margin-top: var(--space-6);
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--space-5);
  color: var(--color-text-subtle);
  font-size: 0.8125rem;
}

.technologies__legend span {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.technologies__legend i {
  width: 0.55rem;
  height: 0.55rem;
  border: 1px solid var(--color-border-strong);
  border-radius: 0.15rem;
  background: var(--color-background-elevated);
}

.technologies__legend span:last-child i {
  border-color: rgb(var(--color-primary-rgb) / 35%);
  background: var(--color-primary-soft);
}

@media (max-width: 64rem) {
  .technologies__heading {
    grid-template-columns: 1fr;
  }

  .technologies__intro {
    grid-column: auto;
  }

  .technologies__headline {
    max-width: 24ch;
  }

  .stack-layer {
    grid-template-columns: minmax(16rem, 0.8fr) minmax(0, 1.2fr);
  }
}

@media (max-width: 48rem) {
  .stack-layer {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .technologies__legend {
    justify-content: flex-start;
  }
}

@media (max-width: 24rem) {
  .technologies__container {
    width: min(100% - (2 * var(--space-4)), var(--container-max-width));
  }

  .stack-layer__context {
    grid-template-columns: 1.75rem minmax(0, 1fr);
  }

  .stack-layer__items {
    gap: var(--space-2);
  }

  .stack-layer__items li {
    padding-inline: 0.75rem;
  }

  .technologies__legend {
    align-items: flex-start;
    flex-direction: column;
    gap: var(--space-3);
  }
}
</style>
