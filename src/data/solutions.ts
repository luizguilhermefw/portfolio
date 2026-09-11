export interface Solution {
  id: string
  index: string
  title: string
  description: string
  capabilities: string[]
}

export const solutions: Solution[] = [
  {
    id: 'integrations',
    index: '01',
    title: 'Integrações',
    description:
      'Conexão entre os produtos Ayla, sistemas de gestão, APIs e plataformas externas para fazer a informação circular pela operação.',
    capabilities: ['REST APIs', 'ERP / CRM', 'E-commerce', 'Webhooks', 'Sincronização de dados'],
  },
  {
    id: 'automation',
    index: '02',
    title: 'Automação de processos',
    description:
      'Automação de rotinas que hoje dependem de atividades manuais ou repetitivas, com fluxos orientados ao processo real da empresa.',
    capabilities: ['Processos', 'Fluxos', 'Dados', 'Comunicação', 'Gatilhos'],
  },
  {
    id: 'ayla-evolution',
    index: '03',
    title: 'Implantação & Evolução Ayla',
    description:
      'Adequações e desenvolvimentos necessários para incorporar o AylaFlow à realidade de cada empresa e preparar sua operação para futuras evoluções do ecossistema Ayla.',
    capabilities: ['AylaFlow', 'Integrações', 'Customizações', 'Implantação', 'Evolução'],
  },
]
