<template>
  <figure class="product-visual" aria-labelledby="product-visual-title">
    <figcaption id="product-visual-title">Representação conceitual do fluxo do produto</figcaption>

    <div class="product-visual__header">
      <div>
        <span class="product-visual__label">AylaFlow</span>
        <strong>Campanha ativa</strong>
      </div>
      <span class="product-visual__channel">WhatsApp</span>
    </div>

    <ol class="product-visual__flow">
      <li>
        <span>01</span>
        <strong>Base de clientes</strong>
        <small>Cadastro organizado</small>
      </li>
      <li>
        <span>02</span>
        <strong>Clientes elegíveis</strong>
        <small>Segmentação e consentimento</small>
      </li>
      <li>
        <span>03</span>
        <strong>Envio programado</strong>
        <small>Comunicação rastreável</small>
      </li>
    </ol>

    <div class="product-visual__footer">
      <span>Texto e imagem</span>
      <span>Histórico registrado</span>
      <span>Opt-out reconhecido</span>
    </div>

    <span class="product-visual__glow" aria-hidden="true"></span>
  </figure>
</template>

<style scoped>
.product-visual {
  position: relative;
  min-width: 0;
  margin: 0;
  padding: clamp(var(--space-5), 4vw, var(--space-8));
  overflow: hidden;
  border: 1px solid rgb(var(--color-primary-rgb) / 20%);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(135deg, rgb(var(--color-primary-rgb) / 5%), transparent 50%),
    var(--color-background-elevated);
  box-shadow: var(--shadow-elevated);
}

.product-visual figcaption {
  margin-bottom: var(--space-5);
  color: var(--color-text-subtle);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.product-visual__header {
  display: flex;
  padding-bottom: var(--space-5);
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.product-visual__header > div {
  display: grid;
  gap: 0.2rem;
}

.product-visual__label {
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 650;
}

.product-visual__header strong {
  color: var(--color-text);
  font-size: 1rem;
}

.product-visual__channel {
  padding: 0.4rem 0.7rem;
  border: 1px solid rgb(var(--color-primary-rgb) / 25%);
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 650;
}

.product-visual__flow {
  display: grid;
  margin-top: var(--space-6);
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
}

.product-visual__flow li {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 9rem;
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: rgb(var(--color-background-rgb) / 55%);
  flex-direction: column;
}

.product-visual__flow li:not(:last-child)::after {
  position: absolute;
  z-index: 2;
  top: 50%;
  right: calc(var(--space-3) * -1 - 0.28rem);
  width: 0.55rem;
  height: 0.55rem;
  border-top: 1px solid var(--color-primary);
  border-right: 1px solid var(--color-primary);
  content: '';
  transform: translateY(-50%) rotate(45deg);
}

.product-visual__flow li > span {
  color: var(--color-primary);
  font-size: 0.6875rem;
  font-weight: 650;
}

.product-visual__flow strong {
  margin-top: auto;
  color: var(--color-text);
  font-size: 0.875rem;
  line-height: 1.3;
}

.product-visual__flow small {
  margin-top: var(--space-2);
  color: var(--color-text-subtle);
  font-size: 0.6875rem;
  line-height: 1.35;
}

.product-visual__footer {
  display: flex;
  margin-top: var(--space-4);
  flex-wrap: wrap;
  gap: var(--space-2);
}

.product-visual__footer span {
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  background: var(--color-surface-soft);
  color: var(--color-text-muted);
  font-size: 0.6875rem;
}

.product-visual__glow {
  position: absolute;
  z-index: -1;
  right: -5rem;
  bottom: -6rem;
  width: 14rem;
  height: 14rem;
  border-radius: 50%;
  background: rgb(var(--color-primary-rgb) / 8%);
  filter: blur(3rem);
}

@media (max-width: 64rem) {
  .product-visual {
    width: 100%;
    max-width: 48rem;
  }
}

@media (max-width: 36rem) {
  .product-visual__flow {
    grid-template-columns: 1fr;
  }

  .product-visual__flow li {
    min-height: 7rem;
  }

  .product-visual__flow li:not(:last-child)::after {
    top: auto;
    right: 50%;
    bottom: calc(var(--space-3) * -1 - 0.28rem);
    transform: translateX(50%) rotate(135deg);
  }
}

@media (max-width: 24rem) {
  .product-visual {
    padding: var(--space-5);
  }
}
</style>
