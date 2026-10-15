<template>
  <section id="contato" class="contact" aria-labelledby="contact-title">
    <div class="contact__container">
      <header class="contact__heading">
        <p class="contact__eyebrow">Contato</p>
        <h2 id="contact-title">Vamos conversar.</h2>
        <p>
          Seja para falar sobre uma oportunidade profissional, uma integração ou o AylaFlow, estou
          aberto a boas conversas.
        </p>
      </header>

      <div class="contact__paths">
        <nav class="contact__links" aria-label="Canais de contato">
          <a href="mailto:ziulprof@gmail.com">
            <span>E-mail</span>
            <strong>ziulprof@gmail.com</strong>
            <i aria-hidden="true">↗</i>
          </a>
          <a
            href="https://www.linkedin.com/in/luizguilhermefw/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>LinkedIn</span>
            <strong>luizguilhermefw</strong>
            <i aria-hidden="true">↗</i>
          </a>
          <a
            href="https://github.com/luizguilhermefw"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>GitHub</span>
            <strong>luizguilhermefw</strong>
            <i aria-hidden="true">↗</i>
          </a>
        </nav>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  position: relative;
  isolation: isolate;
  padding-block: clamp(5rem, 12vw, 10rem);
  overflow: hidden;
  border-top: 1px solid var(--color-border);
  background:
    radial-gradient(circle at 78% 40%, rgb(var(--color-primary-rgb) / 6%), transparent 26rem),
    var(--color-background);
}

.contact::before {
  position: absolute;
  z-index: -1;
  right: -12rem;
  bottom: -18rem;
  width: 34rem;
  height: 34rem;
  border: 1px solid rgb(var(--color-primary-rgb) / 8%);
  border-radius: 50%;
  content: '';
}

.contact__container {
  width: min(100% - (2 * var(--space-5)), var(--container-max-width));
  margin-inline: auto;
}

.contact__heading {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(22rem, 1.1fr);
  gap: clamp(2.5rem, 8vw, 7rem);
}

.contact__eyebrow {
  grid-column: 1 / -1;
  color: var(--color-primary);
  font-size: 0.8125rem;
  font-weight: 650;
  letter-spacing: 0.075em;
  text-transform: uppercase;
}

.contact__heading h2 {
  color: var(--color-text);
  font-size: clamp(3rem, 8vw, 6rem);
  letter-spacing: -0.065em;
  line-height: 0.95;
}

.contact__heading > p:last-child {
  max-width: 38rem;
  align-self: end;
  color: var(--color-text-muted);
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.75;
}

.contact__paths {
  margin-top: clamp(4rem, 9vw, 7rem);
  border-top: 1px solid var(--color-border-strong);
}

.contact__links a {
  display: grid;
  min-width: 0;
  padding-block: clamp(1.5rem, 4vw, 2.5rem);
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  grid-template-columns: minmax(5rem, 0.32fr) minmax(0, 1fr) auto;
  gap: var(--space-5);
  text-decoration: none;
}

.contact__links a > span {
  color: var(--color-text-subtle);
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  transition: color var(--transition-fast);
}

.contact__links strong {
  overflow-wrap: anywhere;
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.2;
  transition: color var(--transition-fast);
}

.contact__links i {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--color-border-strong);
  border-radius: 50%;
  color: var(--color-primary);
  font-size: 1rem;
  font-style: normal;
  place-items: center;
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast),
    transform var(--transition-fast);
}

.contact__links a:hover > span,
.contact__links a:hover strong {
  color: var(--color-primary-hover);
}

.contact__links a:hover i {
  border-color: rgb(var(--color-primary-rgb) / 45%);
  background: var(--color-primary-soft);
  transform: translate(0.1rem, -0.1rem);
}

@media (max-width: 48rem) {
  .contact__heading {
    grid-template-columns: 1fr;
  }

  .contact__heading {
    gap: var(--space-6);
  }

}

@media (max-width: 36rem) {
  .contact__links a {
    align-items: start;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: var(--space-3);
  }

  .contact__links a > span {
    grid-column: 1;
  }

  .contact__links strong {
    grid-row: 2;
    grid-column: 1;
    font-size: 1.125rem;
  }

  .contact__links i {
    grid-row: 1 / 3;
    grid-column: 2;
  }
}

@media (max-width: 24rem) {
  .contact__container {
    width: min(100% - (2 * var(--space-4)), var(--container-max-width));
  }
}
</style>
