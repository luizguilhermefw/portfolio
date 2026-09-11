<template>
  <section id="sobre" class="about" aria-labelledby="about-title">
    <div class="about__container">
      <div class="about__layout">
        <header class="about__heading">
          <p class="about__eyebrow">Sobre</p>
          <h2 id="about-title">Da operação ao código.</h2>
          <p>Entender o contexto faz parte da solução.</p>
        </header>

        <div class="about__narrative">
          <p class="about__lead">
            Minha trajetória em tecnologia começou pela resolução de problemas reais de operação.
            Atuando em suporte técnico e no atendimento de clientes de grande porte, desenvolvi uma visão
            prática sobre sistemas, regras de negócio, integrações e o impacto das decisões técnicas no dia
            a dia das empresas.
          </p>
          <p>
            Em paralelo, transformei esse conhecimento em desenvolvimento de software, construindo
            aplicações e produtos próprios com TypeScript, Node.js, NestJS, Vue e PostgreSQL.
          </p>
          <p>
            Hoje busco unir esses dois lados: entender profundamente o problema e construir uma solução
            tecnicamente consistente.
          </p>
        </div>
      </div>

      <ul class="about__focus" aria-label="Áreas de atuação técnica">
        <li>
          <span aria-hidden="true">01</span>
          <strong>Full Stack / Backend</strong>
        </li>
        <li>
          <span aria-hidden="true">02</span>
          <strong>APIs &amp; Integrações</strong>
        </li>
        <li>
          <span aria-hidden="true">03</span>
          <strong>SaaS &amp; Produtos</strong>
        </li>
        <li>
          <span aria-hidden="true">04</span>
          <strong>SQL &amp; PostgreSQL</strong>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.about {
  position: relative;
  isolation: isolate;
  padding-block: clamp(5rem, 11vw, 9rem);
  overflow: hidden;
  border-top: 1px solid var(--color-border);
  background:
    radial-gradient(circle at 12% 25%, rgb(var(--color-primary-rgb) / 5%), transparent 24rem),
    var(--color-background);
}

.about::before {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 50%;
  width: 1px;
  height: min(30rem, 62%);
  background: linear-gradient(var(--color-border-strong), transparent);
  content: '';
}

.about__container {
  width: min(100% - (2 * var(--space-5)), var(--container-max-width));
  margin-inline: auto;
}

.about__layout {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(24rem, 1.18fr);
  gap: clamp(3rem, 9vw, 8rem);
}

.about__heading {
  align-self: start;
}

.about__eyebrow {
  color: var(--color-primary);
  font-size: 0.8125rem;
  font-weight: 650;
  letter-spacing: 0.075em;
  text-transform: uppercase;
}

.about__heading h2 {
  max-width: 9ch;
  margin-top: var(--space-3);
  color: var(--color-text);
  font-size: clamp(2.75rem, 7vw, 5rem);
  letter-spacing: -0.06em;
  line-height: 0.98;
}

.about__heading > p:last-child {
  max-width: 24ch;
  margin-top: var(--space-6);
  color: var(--color-text-muted);
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.65;
}

.about__narrative {
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border-strong);
}

.about__narrative p {
  max-width: 48rem;
  color: var(--color-text-muted);
  font-size: 1rem;
  line-height: 1.8;
}

.about__narrative .about__lead {
  color: var(--color-text);
  font-size: clamp(1.125rem, 2.4vw, 1.375rem);
  letter-spacing: -0.015em;
  line-height: 1.65;
}

.about__narrative p + p {
  margin-top: var(--space-6);
}

.about__focus {
  display: grid;
  margin-top: clamp(4rem, 10vw, 8rem);
  border-block: 1px solid var(--color-border-strong);
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.about__focus li {
  display: flex;
  min-width: 0;
  min-height: 8.5rem;
  padding: var(--space-5);
  justify-content: space-between;
  flex-direction: column;
  gap: var(--space-8);
}

.about__focus li + li {
  border-left: 1px solid var(--color-border);
}

.about__focus span {
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.08em;
}

.about__focus strong {
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.35;
}

@media (max-width: 64rem) {
  .about__layout {
    grid-template-columns: minmax(0, 0.72fr) minmax(22rem, 1.28fr);
    gap: clamp(2.5rem, 6vw, 5rem);
  }

  .about__focus {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about__focus li:nth-child(3) {
    border-left: 0;
  }

  .about__focus li:nth-child(n + 3) {
    border-top: 1px solid var(--color-border);
  }
}

@media (max-width: 48rem) {
  .about::before {
    display: none;
  }

  .about__layout {
    grid-template-columns: 1fr;
  }

  .about__heading h2 {
    max-width: 12ch;
  }
}

@media (max-width: 36rem) {
  .about__focus {
    grid-template-columns: 1fr;
  }

  .about__focus li {
    min-height: 7rem;
  }

  .about__focus li + li,
  .about__focus li:nth-child(3) {
    border-top: 1px solid var(--color-border);
    border-left: 0;
  }
}

@media (max-width: 24rem) {
  .about__container {
    width: min(100% - (2 * var(--space-4)), var(--container-max-width));
  }

  .about__focus li {
    padding-inline: var(--space-4);
  }
}
</style>
