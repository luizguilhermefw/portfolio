<script setup lang="ts">
import { solutions } from '../data/solutions'
</script>

<template>
  <section id="servicos" class="services" aria-labelledby="services-title">
    <div class="services__container">
      <header class="services__heading">
        <p class="services__eyebrow">Soluções para a operação</p>
        <div class="services__title-group">
          <h2 id="services-title">Soluções <span>&amp; Integrações</span></h2>
          <p>Tecnologia conectada à operação.</p>
        </div>
        <p class="services__intro">
          Além do AylaFlow, desenvolvo integrações e automações para conectar sistemas, reduzir
          processos manuais e adaptar a solução à realidade de cada operação.
        </p>
      </header>

      <div class="solutions-list">
        <article v-for="solution in solutions" :key="solution.id" class="solution-row">
          <span class="solution-row__index" aria-hidden="true">{{ solution.index }}</span>
          <div class="solution-row__content">
            <h3>{{ solution.title }}</h3>
            <p>{{ solution.description }}</p>
          </div>
          <ul class="solution-row__capabilities">
            <li v-for="capability in solution.capabilities" :key="capability">
              {{ capability }}
            </li>
          </ul>
        </article>
      </div>

      <div class="services__consultative">
        <span class="services__consultative-line" aria-hidden="true"></span>
        <div>
          <p>Antes do código, vem o entendimento do problema.</p>
          <p>
            Cada integração ou automação começa pela análise do processo atual, das limitações e do
            resultado esperado.
          </p>
        </div>
      </div>

      <div class="services__cta">
        <div>
          <p>Integração em contexto</p>
          <h3>Tem um processo manual ou precisa conectar o AylaFlow à sua operação?</h3>
        </div>
        <a href="#contato">Conversar sobre uma integração</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  position: relative;
  isolation: isolate;
  padding-block: clamp(5rem, 11vw, 9rem);
  overflow: hidden;
  border-top: 1px solid var(--color-border);
  background:
    linear-gradient(180deg, rgb(var(--color-primary-rgb) / 3%), transparent 22rem),
    var(--color-background);
}

.services::before {
  position: absolute;
  z-index: -1;
  top: 0;
  left: max(var(--space-5), calc((100vw - var(--container-max-width)) / 2));
  width: 1px;
  height: 100%;
  background: linear-gradient(var(--color-border-strong), transparent 72%);
  content: '';
}

.services__container {
  width: min(100% - (2 * var(--space-5)), var(--container-max-width));
  margin-inline: auto;
}

.services__heading {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(20rem, 0.72fr);
  gap: clamp(2.5rem, 8vw, 7rem);
}

.services__eyebrow {
  grid-column: 1 / -1;
  color: var(--color-primary);
  font-size: 0.8125rem;
  font-weight: 650;
  letter-spacing: 0.075em;
  text-transform: uppercase;
}

.services__title-group h2 {
  color: var(--color-text);
  font-size: clamp(2.75rem, 7vw, 5rem);
  letter-spacing: -0.06em;
  line-height: 0.98;
}

.services__title-group h2 span {
  display: block;
  color: var(--color-text-muted);
}

.services__title-group > p {
  margin-top: var(--space-6);
  color: var(--color-text);
  font-size: clamp(1.25rem, 2.7vw, 1.875rem);
  font-weight: 600;
  letter-spacing: -0.035em;
}

.services__intro {
  align-self: end;
  color: var(--color-text-muted);
  font-size: 1rem;
  line-height: 1.75;
}

.solutions-list {
  margin-top: clamp(4rem, 9vw, 7rem);
  border-top: 1px solid var(--color-border-strong);
}

.solution-row {
  display: grid;
  min-width: 0;
  padding-block: clamp(2rem, 5vw, 3.75rem);
  border-bottom: 1px solid var(--color-border);
  grid-template-columns: 3rem minmax(16rem, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(1.5rem, 5vw, 4.5rem);
}

.solution-row__index {
  padding-top: 0.35rem;
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.08em;
}

.solution-row__content h3 {
  color: var(--color-text);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  letter-spacing: -0.04em;
  line-height: 1.15;
}

.solution-row__content p {
  max-width: 39rem;
  margin-top: var(--space-4);
  color: var(--color-text-muted);
  font-size: 0.9375rem;
  line-height: 1.7;
}

.solution-row__capabilities {
  display: flex;
  align-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.solution-row__capabilities li {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: rgb(var(--color-background-rgb) / 45%);
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  line-height: 1.2;
}

.services__consultative {
  display: grid;
  margin-top: clamp(3.5rem, 8vw, 6rem);
  grid-template-columns: minmax(5rem, 0.35fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 5rem);
}

.services__consultative-line {
  height: 1px;
  margin-top: 0.8rem;
  background: var(--color-primary);
}

.services__consultative > div {
  max-width: 48rem;
}

.services__consultative > div > p:first-child {
  color: var(--color-text);
  font-size: clamp(1.25rem, 2.6vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.3;
}

.services__consultative > div > p:last-child {
  margin-top: var(--space-3);
  color: var(--color-text-muted);
  line-height: 1.7;
}

.services__cta {
  display: flex;
  margin-top: clamp(4rem, 9vw, 7rem);
  padding: clamp(var(--space-6), 5vw, var(--space-10));
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-8);
  border: 1px solid rgb(var(--color-primary-rgb) / 20%);
  border-radius: var(--radius-lg);
  background: linear-gradient(110deg, var(--color-primary-soft), var(--color-background-elevated));
}

.services__cta > div > p {
  color: var(--color-primary);
  font-size: 0.8125rem;
  font-weight: 650;
  letter-spacing: 0.075em;
  text-transform: uppercase;
}

.services__cta h3 {
  max-width: 27ch;
  margin-top: var(--space-3);
  color: var(--color-text);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  letter-spacing: -0.035em;
  line-height: 1.2;
}

.services__cta a {
  display: inline-flex;
  min-height: 3rem;
  padding-inline: var(--space-5);
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: var(--color-on-primary);
  box-shadow: var(--shadow-primary);
  font-size: 0.875rem;
  font-weight: 650;
  text-align: center;
  text-decoration: none;
  transition:
    background-color var(--transition-fast),
    transform var(--transition-fast);
}

.services__cta a:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

@media (max-width: 64rem) {
  .solution-row {
    grid-template-columns: 2.5rem minmax(15rem, 0.9fr) minmax(0, 1.1fr);
  }
}

@media (max-width: 48rem) {
  .services__heading,
  .solution-row {
    grid-template-columns: 1fr;
  }

  .services__heading {
    gap: var(--space-6);
  }

  .solution-row {
    gap: var(--space-5);
  }

  .solution-row__index {
    padding-top: 0;
  }

  .services__cta {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 36rem) {
  .services__consultative {
    grid-template-columns: 2.5rem minmax(0, 1fr);
    gap: var(--space-4);
  }

  .services__cta,
  .services__cta a {
    width: 100%;
  }
}

@media (max-width: 24rem) {
  .services__container {
    width: min(100% - (2 * var(--space-4)), var(--container-max-width));
  }

  .services__cta {
    padding: var(--space-5);
  }
}
</style>
