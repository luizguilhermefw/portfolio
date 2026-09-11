export interface TechnologyItem {
  name: string
  type: 'technology' | 'practice'
}

export interface TechnologyGroup {
  id: string
  title: string
  description: string
  items: TechnologyItem[]
}

export const technologyGroups: TechnologyGroup[] = [
  {
    id: 'backend',
    title: 'Backend',
    description: 'APIs, regras de negócio, persistência e processamento assíncrono.',
    items: [
      { name: 'TypeScript', type: 'technology' },
      { name: 'Node.js', type: 'technology' },
      { name: 'NestJS', type: 'technology' },
      { name: 'PostgreSQL', type: 'technology' },
      { name: 'Prisma', type: 'technology' },
      { name: 'REST APIs', type: 'technology' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'Interfaces para produtos SaaS e aplicações web responsivas.',
    items: [
      { name: 'Vue 3', type: 'technology' },
      { name: 'Pinia', type: 'technology' },
      { name: 'Vue Router', type: 'technology' },
      { name: 'Vite', type: 'technology' },
    ],
  },
  {
    id: 'infrastructure',
    title: 'Infraestrutura e fluxo',
    description: 'Ambientes reproduzíveis e um fluxo de desenvolvimento versionado.',
    items: [
      { name: 'Docker', type: 'technology' },
      { name: 'Git', type: 'technology' },
      { name: 'GitHub', type: 'technology' },
    ],
  },
  {
    id: 'architecture',
    title: 'Arquitetura e integrações',
    description: 'Comunicação entre sistemas, isolamento de dados e operações confiáveis.',
    items: [
      { name: 'JWT', type: 'technology' },
      { name: 'APIs e integrações', type: 'practice' },
      { name: 'WhatsApp / Evolution API', type: 'technology' },
      { name: 'Firebase', type: 'technology' },
      { name: 'Multi-tenant', type: 'practice' },
      { name: 'Processamento assíncrono', type: 'practice' },
    ],
  },
]
