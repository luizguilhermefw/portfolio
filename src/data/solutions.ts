export interface Solution {
  id: string
  index: string
  title: string
  description: string
  capabilities: string[]
}

export const solutions: Solution[] = [
  {
    id: 'aylaflow',
    index: '01',
    title: 'AylaFlow',
    description:
      'Automação comercial e relacionamento com clientes para organizar a base, planejar campanhas e reativar oportunidades pelo WhatsApp.',
    capabilities: ['Clientes', 'Segmentação', 'Campanhas', 'Reativação', 'WhatsApp'],
  },
  {
    id: 'ai-service',
    index: '02',
    title: 'Atendimento com IA',
    description:
      'Desenvolvimento de soluções personalizadas de atendimento com inteligência artificial para WhatsApp, Instagram e sites.',
    capabilities: ['WhatsApp', 'Instagram', 'Sites', 'Atendimento', 'Contexto'],
  },
  {
    id: 'automation',
    index: '03',
    title: 'Automações empresariais',
    description:
      'Automação de rotinas repetitivas e fluxos operacionais orientados ao processo real da empresa.',
    capabilities: ['Processos', 'Fluxos', 'Dados', 'Gatilhos', 'Rotinas'],
  },
  {
    id: 'integrations',
    index: '04',
    title: 'Integrações entre sistemas e APIs',
    description:
      'Conexão entre sistemas de gestão, APIs, e-commerces e plataformas externas para fazer a informação circular pela operação.',
    capabilities: ['REST APIs', 'ERP / CRM', 'E-commerce', 'Webhooks', 'Sincronização'],
  },
  {
    id: 'dashboards',
    index: '05',
    title: 'Dashboards de indicadores',
    description:
      'Painéis personalizados para acompanhar resultados, desempenho, metas e evolução com informações mais claras para o negócio.',
    capabilities: ['Indicadores', 'Metas', 'Filtros', 'Evolução', 'Exportações'],
  },
  {
    id: 'websites',
    index: '06',
    title: 'Sites e landing pages',
    description:
      'Sites institucionais e landing pages para apresentar empresas, soluções e oportunidades de contato com clareza.',
    capabilities: ['Institucional', 'Landing pages', 'Responsivo', 'SEO', 'Contato'],
  },
]
