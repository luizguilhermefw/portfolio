<script setup lang="ts">
import AylaFlowCapabilityList from '../components/aylaflow/AylaFlowCapabilityList.vue'
import AylaFlowProductVisual from '../components/aylaflow/AylaFlowProductVisual.vue'
</script>

<template>
  <section id="aylaflow" class="aylaflow" aria-labelledby="aylaflow-title">
    <div class="aylaflow__container">
      <div class="aylaflow__intro">
        <div class="aylaflow__copy">
          <p class="aylaflow__eyebrow">Produto LFWeb Studio</p>
          <h2 id="aylaflow-title">AylaFlow</h2>
          <p class="aylaflow__headline">Transforme uma base parada em relacionamento contínuo.</p>
          <p class="aylaflow__description">
            Um SaaS de automação comercial para organizar clientes, criar campanhas e manter uma
            comunicação recorrente pelo WhatsApp — com clareza sobre quem pode receber cada mensagem.
          </p>

          <div class="aylaflow__actions">
            <a
              class="aylaflow__button aylaflow__button--primary"
              href="https://www.aylaflow.com.br/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Acessar AylaFlow
            </a>
            <a class="aylaflow__button aylaflow__button--secondary" href="#projetos">
              Ver case técnico
            </a>
          </div>
        </div>

        <AylaFlowProductVisual />
      </div>

      <div class="aylaflow__context">
        <article class="context-block">
          <p class="context-block__index" aria-hidden="true">01</p>
          <h3>Quando a base deixa de ser lembrada</h3>
          <p>
            Muitas empresas conquistam clientes, mas perdem contato com eles ao longo do tempo.
            Campanhas isoladas, reativação manual e um pós-venda inconsistente tornam esse relacionamento
            difícil de manter.
          </p>
          <ul>
            <li>Bases de clientes sem uma rotina de relacionamento</li>
            <li>Campanhas e retomadas dependentes de trabalho manual</li>
            <li>Pouca clareza sobre consentimento e elegibilidade</li>
          </ul>
        </article>

        <article class="context-block context-block--solution">
          <p class="context-block__index" aria-hidden="true">02</p>
          <h3>Uma operação recorrente e organizada</h3>
          <p>
            O AylaFlow reúne a base de clientes e oferece uma estrutura para segmentar públicos, planejar
            campanhas e automatizar contatos pelo WhatsApp sem perder o controle da comunicação.
          </p>
          <ul>
            <li>Clientes e históricos centralizados</li>
            <li>Comunicações planejadas para públicos definidos</li>
            <li>Envios processados de forma controlada e rastreável</li>
          </ul>
        </article>
      </div>

      <div class="aylaflow__capabilities">
        <header class="section-heading">
          <p>Principais capacidades</p>
          <h3>Uma base para relacionamentos que não dependem da memória.</h3>
        </header>

        <AylaFlowCapabilityList />
      </div>

      <div class="aylaflow__how-it-works">
        <header class="section-heading section-heading--compact">
          <p>Como funciona</p>
          <h3>Da base à comunicação, em um fluxo simples.</h3>
        </header>

        <ol class="workflow">
          <li>
            <span>1</span>
            <div>
              <h4>Organize a base</h4>
              <p>Cadastre clientes e mantenha os dados de relacionamento em um só lugar.</p>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <h4>Defina público e mensagem</h4>
              <p>Segmente clientes e prepare uma campanha ou automação adequada ao contexto.</p>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <h4>Acompanhe a comunicação</h4>
              <p>Processe os envios pelo WhatsApp e consulte status e histórico.</p>
            </div>
          </li>
        </ol>
      </div>

      <aside class="aylaflow__control" aria-labelledby="control-title">
        <div class="aylaflow__control-mark" aria-hidden="true">PARAR</div>
        <div>
          <p>Consentimento e controle</p>
          <h3 id="control-title">Relacionamento também significa respeitar escolhas.</h3>
          <p>
            O produto permite definir clientes elegíveis, reconhecer solicitações de opt-out e manter o
            histórico registrado. Fluxos pensados para apoiar boas práticas de consentimento e privacidade.
          </p>
        </div>
      </aside>

      <div class="aylaflow__closing">
        <div>
          <p>Relacionamento contínuo começa com organização.</p>
          <h3>Conheça o AylaFlow e converse sobre o cenário da sua empresa.</h3>
        </div>
        <a
          class="aylaflow__button aylaflow__button--primary"
          href="https://www.aylaflow.com.br/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Conhecer o AylaFlow
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.aylaflow {
  position: relative;
  isolation: isolate;
  padding-block: clamp(5rem, 11vw, 9rem);
  overflow: hidden;
  border-top: 1px solid var(--color-border);
  background:
    linear-gradient(180deg, rgb(8 23 43 / 52%), transparent 24rem),
    var(--color-background);
}

.aylaflow::before {
  position: absolute;
  z-index: -1;
  top: 4rem;
  left: 50%;
  width: min(90vw, 72rem);
  height: 28rem;
  border: 1px solid rgb(var(--color-primary-rgb) / 7%);
  border-radius: 50%;
  content: '';
  transform: translateX(-50%) rotate(-8deg);
}

.aylaflow__container {
  width: min(100% - (2 * var(--space-5)), var(--container-max-width));
  margin-inline: auto;
}

.aylaflow__intro {
  display: grid;
  align-items: center;
  grid-template-columns: minmax(0, 0.88fr) minmax(26rem, 1.12fr);
  gap: clamp(3rem, 7vw, 6rem);
}

.aylaflow__eyebrow,
.section-heading > p,
.aylaflow__control > div > p:first-child,
.aylaflow__closing > div > p {
  color: var(--color-primary);
  font-size: 0.8125rem;
  font-weight: 650;
  letter-spacing: 0.075em;
  text-transform: uppercase;
}

.aylaflow__copy h2 {
  margin-top: var(--space-3);
  color: var(--color-text);
  font-size: clamp(3rem, 8vw, 6rem);
  letter-spacing: -0.065em;
  line-height: 0.95;
}

.aylaflow__headline {
  max-width: 15ch;
  margin-top: var(--space-6);
  color: var(--color-text);
  font-size: clamp(1.5rem, 3.2vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.2;
}

.aylaflow__description {
  max-width: 38rem;
  margin-top: var(--space-5);
  color: var(--color-text-muted);
  font-size: 1rem;
  line-height: 1.75;
}

.aylaflow__actions {
  display: flex;
  margin-top: var(--space-8);
  flex-wrap: wrap;
  gap: var(--space-3);
}

.aylaflow__button {
  display: inline-flex;
  min-height: 3rem;
  padding-inline: var(--space-5);
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 650;
  text-align: center;
  text-decoration: none;
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast);
}

.aylaflow__button:hover {
  transform: translateY(-1px);
}

.aylaflow__button--primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
  box-shadow: var(--shadow-primary);
}

.aylaflow__button--primary:hover {
  background: var(--color-primary-hover);
}

.aylaflow__button--secondary {
  border-color: var(--color-border-strong);
  background: var(--color-surface-soft);
  color: var(--color-text);
}

.aylaflow__button--secondary:hover {
  border-color: rgb(var(--color-primary-rgb) / 42%);
  color: var(--color-primary);
}

.aylaflow__context {
  display: grid;
  margin-top: clamp(5rem, 11vw, 9rem);
  border-block: 1px solid var(--color-border);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.context-block {
  position: relative;
  padding: clamp(2rem, 5vw, 4rem);
}

.context-block + .context-block {
  border-left: 1px solid var(--color-border);
}

.context-block--solution {
  background: linear-gradient(135deg, var(--color-primary-soft), transparent 70%);
}

.context-block__index {
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 650;
}

.context-block h3,
.section-heading h3,
.aylaflow__control h3,
.aylaflow__closing h3 {
  color: var(--color-text);
  letter-spacing: -0.035em;
  line-height: 1.2;
}

.context-block h3 {
  max-width: 18ch;
  margin-top: var(--space-4);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
}

.context-block > p:not(.context-block__index) {
  margin-top: var(--space-5);
  color: var(--color-text-muted);
  line-height: 1.7;
}

.context-block ul {
  display: grid;
  margin-top: var(--space-6);
  gap: var(--space-3);
}

.context-block li {
  position: relative;
  padding-left: var(--space-5);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.5;
}

.context-block li::before {
  position: absolute;
  top: 0.65em;
  left: 0;
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 50%;
  background: var(--color-primary);
  content: '';
}

.aylaflow__capabilities,
.aylaflow__how-it-works {
  margin-top: clamp(5rem, 10vw, 8rem);
}

.section-heading {
  display: grid;
  align-items: end;
  grid-template-columns: minmax(10rem, 0.55fr) minmax(0, 1fr);
  gap: var(--space-8);
}

.section-heading h3 {
  max-width: 24ch;
  font-size: clamp(1.75rem, 4vw, 3rem);
}

.section-heading--compact h3 {
  max-width: 20ch;
}

.workflow {
  display: grid;
  margin-top: var(--space-10);
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.workflow li {
  display: grid;
  min-width: 0;
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border-strong);
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-4);
}

.workflow li > span {
  display: grid;
  width: 2rem;
  height: 2rem;
  border: 1px solid rgb(var(--color-primary-rgb) / 32%);
  border-radius: 50%;
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 650;
  place-items: center;
}

.workflow h4 {
  color: var(--color-text);
  font-size: 1rem;
}

.workflow p {
  margin-top: var(--space-3);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.65;
}

.aylaflow__control {
  display: grid;
  margin-top: clamp(5rem, 10vw, 8rem);
  padding: clamp(var(--space-6), 5vw, var(--space-10));
  align-items: center;
  border: 1px solid rgb(var(--color-primary-rgb) / 20%);
  border-radius: var(--radius-lg);
  background: linear-gradient(105deg, var(--color-primary-soft), var(--color-background-elevated));
  grid-template-columns: minmax(8rem, 0.38fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 5rem);
}

.aylaflow__control-mark {
  display: grid;
  aspect-ratio: 1;
  border: 1px solid rgb(var(--color-primary-rgb) / 25%);
  border-radius: 50%;
  color: var(--color-primary);
  font-size: clamp(0.75rem, 2vw, 1rem);
  font-weight: 700;
  letter-spacing: 0.12em;
  place-items: center;
}

.aylaflow__control h3 {
  max-width: 25ch;
  margin-top: var(--space-3);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
}

.aylaflow__control > div > p:last-child {
  max-width: 48rem;
  margin-top: var(--space-4);
  color: var(--color-text-muted);
  line-height: 1.7;
}

.aylaflow__closing {
  display: flex;
  margin-top: clamp(5rem, 10vw, 8rem);
  padding-top: var(--space-10);
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-8);
  border-top: 1px solid var(--color-border);
}

.aylaflow__closing h3 {
  max-width: 27ch;
  margin-top: var(--space-3);
  font-size: clamp(1.5rem, 3vw, 2.5rem);
}

@media (max-width: 64rem) {
  .aylaflow__intro {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 48rem) {
  .aylaflow__context,
  .section-heading,
  .workflow,
  .aylaflow__control {
    grid-template-columns: 1fr;
  }

  .context-block + .context-block {
    border-top: 1px solid var(--color-border);
    border-left: 0;
  }

  .aylaflow__control-mark {
    width: 7rem;
  }

  .aylaflow__closing {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 36rem) {
  .aylaflow__actions,
  .aylaflow__button {
    width: 100%;
  }
}

@media (max-width: 24rem) {
  .aylaflow__container {
    width: min(100% - (2 * var(--space-4)), var(--container-max-width));
  }

  .context-block,
  .aylaflow__control {
    padding: var(--space-5);
  }
}
</style>
