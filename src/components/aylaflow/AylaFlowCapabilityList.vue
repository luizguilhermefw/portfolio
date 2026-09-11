<script setup lang="ts">
interface Capability {
  title: string
  description: string
}

const capabilities: Capability[] = [
  {
    title: 'Clientes e segmentação',
    description: 'Cadastre, organize e selecione públicos para cada comunicação.',
  },
  {
    title: 'Campanhas',
    description: 'Planeje mensagens promocionais ou recorrentes para grupos definidos.',
  },
  {
    title: 'Automações de reativação',
    description: 'Estruture contatos para clientes inativos e outras rotinas, como aniversários.',
  },
  {
    title: 'Comunicação por WhatsApp',
    description: 'Envie mensagens de texto ou imagem pelo canal central do produto.',
  },
  {
    title: 'Consentimento e opt-out',
    description: 'Controle elegibilidade e reconheça pedidos de interrupção com a palavra PARAR.',
  },
  {
    title: 'Status e histórico',
    description: 'Acompanhe o processamento e mantenha registros das mensagens enviadas.',
  },
]
</script>

<template>
  <ul class="capability-list">
    <li v-for="(capability, index) in capabilities" :key="capability.title">
      <span>{{ String(index + 1).padStart(2, '0') }}</span>
      <h4>{{ capability.title }}</h4>
      <p>{{ capability.description }}</p>
    </li>
  </ul>
</template>

<style scoped>
.capability-list {
  display: grid;
  margin-top: var(--space-10);
  border-top: 1px solid var(--color-border);
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.capability-list li {
  min-width: 0;
  padding: var(--space-6);
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.capability-list li:nth-child(3n + 1) {
  border-left: 1px solid var(--color-border);
}

.capability-list span {
  color: var(--color-primary);
  font-size: 0.6875rem;
  font-weight: 650;
}

.capability-list h4 {
  margin-top: var(--space-8);
  color: var(--color-text);
  font-size: 1rem;
}

.capability-list p {
  margin-top: var(--space-3);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.65;
}

@media (max-width: 48rem) {
  .capability-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .capability-list li:nth-child(3n + 1) {
    border-left: 0;
  }

  .capability-list li:nth-child(2n + 1) {
    border-left: 1px solid var(--color-border);
  }
}

@media (max-width: 36rem) {
  .capability-list {
    grid-template-columns: 1fr;
  }

  .capability-list li,
  .capability-list li:nth-child(3n + 1),
  .capability-list li:nth-child(2n + 1) {
    border-left: 1px solid var(--color-border);
  }
}
</style>
