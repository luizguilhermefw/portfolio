<template>
  <section id="inicio" class="hero" aria-labelledby="hero-title">
    <div class="hero__atmosphere" aria-hidden="true"></div>

    <div class="hero__container">
      <div class="hero__content">
        <p class="hero__eyebrow">Desenvolvimento de software <span>•</span> SaaS <span>•</span> Integrações</p>

        <p class="hero__name">Luiz Guilherme Fernandes Wagner</p>
        <h1 id="hero-title">Full Stack <span>Developer</span></h1>
        <p class="hero__expertise">Backend · APIs · SaaS · Integrações</p>

        <p class="hero__description">
          Construo aplicações web, APIs e produtos digitais com foco em arquitetura, integrações e
          resolução de problemas reais.
        </p>

        <div class="hero__actions" aria-label="Ações principais">
          <a class="button button--primary" href="#projetos">Ver projetos</a>
          <a
            class="button button--secondary"
            href="https://github.com/luizguilhermefw"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a class="button button--text" href="#contato">Entrar em contato</a>
        </div>
      </div>

      <div class="hero__orbit" aria-hidden="true">
        <span class="hero__orbit-line"></span>
        <span class="hero__orbit-point"></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  min-height: calc(100svh - var(--header-height));
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 20%, rgb(var(--color-primary-rgb) / 5%), transparent 26rem),
    var(--color-background);
}

.hero::before {
  position: absolute;
  z-index: -2;
  inset: 0;
  background-image:
    radial-gradient(circle, rgb(255 255 255 / 24%) 0 0.6px, transparent 0.8px),
    radial-gradient(circle, rgb(var(--color-primary-rgb) / 16%) 0 0.7px, transparent 0.9px);
  background-position:
    0 0,
    2.5rem 3.5rem;
  background-size:
    5.5rem 5.5rem,
    8rem 8rem;
  content: '';
  mask-image: linear-gradient(to bottom, black, transparent 92%);
  opacity: 0.38;
}

.hero__atmosphere {
  position: absolute;
  z-index: -1;
  top: -16rem;
  right: -18rem;
  width: 46rem;
  height: 46rem;
  border: 1px solid rgb(var(--color-primary-rgb) / 8%);
  border-radius: 50%;
  box-shadow:
    0 0 0 5rem rgb(var(--color-primary-rgb) / 2%),
    0 0 0 12rem rgb(30 74 122 / 2%);
}

.hero__container {
  position: relative;
  display: grid;
  width: min(100% - (2 * var(--space-5)), var(--container-max-width));
  min-height: calc(100svh - var(--header-height));
  margin-inline: auto;
  padding-block: var(--space-12);
  align-items: center;
  grid-template-columns: minmax(0, 1fr) minmax(15rem, 0.42fr);
  gap: var(--space-10);
}

.hero__content {
  max-width: 48rem;
}

.hero__eyebrow {
  display: flex;
  margin-bottom: var(--space-6);
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.045em;
  text-transform: uppercase;
}

.hero__eyebrow span {
  color: var(--color-text-subtle);
}

.hero__name {
  margin-bottom: var(--space-3);
  color: var(--color-text-muted);
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 500;
  letter-spacing: 0.01em;
}

.hero h1 {
  max-width: 12ch;
  color: var(--color-text);
  font-size: clamp(3rem, 8vw, 6.75rem);
  font-weight: 700;
  letter-spacing: -0.065em;
  line-height: 0.95;
}

.hero h1 span {
  color: var(--color-primary);
}

.hero__expertise {
  margin-top: var(--space-5);
  color: var(--color-text);
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 500;
}

.hero__description {
  max-width: 42rem;
  margin-top: var(--space-6);
  color: var(--color-text-muted);
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.75;
}

.hero__actions {
  display: flex;
  margin-top: var(--space-8);
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.button {
  display: inline-flex;
  min-height: 3rem;
  padding-inline: var(--space-5);
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-size: 0.9375rem;
  font-weight: 650;
  text-decoration: none;
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast);
}

.button:hover {
  transform: translateY(-1px);
}

.button--primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
  box-shadow: var(--shadow-primary);
}

.button--primary:hover {
  background: var(--color-primary-hover);
}

.button--secondary {
  border-color: var(--color-border-strong);
  background: var(--color-surface-soft);
  color: var(--color-text);
}

.button--secondary:hover {
  border-color: rgb(var(--color-primary-rgb) / 42%);
  background: var(--color-primary-soft);
}

.button--text {
  color: var(--color-text-muted);
}

.button--text:hover {
  color: var(--color-primary);
}

.hero__orbit {
  position: relative;
  width: min(25vw, 18rem);
  aspect-ratio: 1;
  justify-self: end;
}

.hero__orbit-line {
  position: absolute;
  inset: 0;
  border: 1px solid rgb(var(--color-primary-rgb) / 22%);
  border-radius: 50%;
  transform: rotate(-24deg) scaleY(0.42);
}

.hero__orbit-line::before,
.hero__orbit-line::after {
  position: absolute;
  border-radius: 50%;
  content: '';
}

.hero__orbit-line::before {
  inset: 24%;
  border: 1px solid rgb(255 255 255 / 10%);
}

.hero__orbit-line::after {
  inset: 42%;
  background: var(--color-primary);
  box-shadow: 0 0 2.5rem rgb(var(--color-primary-rgb) / 32%);
}

.hero__orbit-point {
  position: absolute;
  top: 49%;
  right: -0.2rem;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: var(--color-text);
  box-shadow: 0 0 1.25rem rgb(255 255 255 / 36%);
}

@media (max-width: 56rem) {
  .hero__container {
    grid-template-columns: minmax(0, 1fr);
  }

  .hero__orbit {
    position: absolute;
    z-index: -1;
    top: 12%;
    right: -5rem;
    width: 18rem;
    opacity: 0.5;
  }
}

@media (max-width: 40rem) {
  .hero__container {
    padding-block: var(--space-9);
  }

  .hero__eyebrow {
    max-width: 27rem;
    margin-bottom: var(--space-5);
    font-size: 0.75rem;
    line-height: 1.7;
  }

  .hero h1 {
    font-size: clamp(2.75rem, 15vw, 4.5rem);
  }

  .hero__actions {
    align-items: stretch;
  }

  .button--primary,
  .button--secondary {
    flex: 1 1 9rem;
  }

  .button--text {
    flex-basis: 100%;
    justify-content: flex-start;
    padding-inline: 0;
  }
}

@media (max-width: 24rem) {
  .hero__container {
    width: min(100% - (2 * var(--space-4)), var(--container-max-width));
  }

  .hero__name {
    max-width: 18rem;
  }
}
</style>
