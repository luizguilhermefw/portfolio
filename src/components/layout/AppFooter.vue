<template>
  <footer class="app-footer">
    <div class="app-footer__container">
      <div class="app-footer__identity">
        <strong>LFWeb <span>Studio</span></strong>
        <p>Luiz Guilherme Fernandes Wagner</p>
        <p>Desenvolvimento, integrações e produtos digitais.</p>
      </div>

      <div class="app-footer__meta">
        <nav aria-label="Links externos do rodapé">
          <a
            href="https://github.com/luizguilhermefw"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/luizguilhermefw/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </nav>
        <p>© 2026 LFWeb Studio</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid var(--color-border);
  background: var(--color-background);
}

.app-footer__container {
  display: flex;
  width: min(100% - (2 * var(--space-5)), var(--container-max-width));
  min-height: 13rem;
  margin-inline: auto;
  padding-block: var(--space-8);
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-8);
}

.app-footer__identity strong {
  color: var(--color-text);
  font-size: 1rem;
  letter-spacing: -0.025em;
}

.app-footer__identity strong span {
  color: var(--color-primary);
}

.app-footer__identity p {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.5;
}

.app-footer__identity strong + p {
  margin-top: var(--space-4);
}

.app-footer__identity p + p {
  margin-top: var(--space-1);
  color: var(--color-text-subtle);
}

.app-footer__meta {
  display: grid;
  justify-items: end;
  gap: var(--space-5);
}

.app-footer__meta nav {
  display: flex;
  gap: var(--space-5);
}

.app-footer__meta a {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.app-footer__meta a:hover {
  color: var(--color-primary);
}

.app-footer__meta p {
  color: var(--color-text-subtle);
  font-size: 0.8125rem;
}

@media (max-width: 36rem) {
  .app-footer__container {
    min-height: 0;
    padding-block: var(--space-10);
    align-items: flex-start;
    flex-direction: column;
  }

  .app-footer__meta {
    justify-items: start;
  }
}

@media (max-width: 24rem) {
  .app-footer__container {
    width: min(100% - (2 * var(--space-4)), var(--container-max-width));
  }
}
</style>
