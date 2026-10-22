import arcompiImage from '../../images/projects/img-arcompi.webp'
import aylaFlowImage from '../../images/projects/img-aylaflow.png'
import blogImage from '../../images/projects/img-blog.webp'
import campaignImage from '../../images/projects/img-jogo-campanha.webp'
import formulaOneImage from '../../images/projects/img-formula1.webp'
import horaDoLivroImage from '../../images/projects/img-horadolivro.png'
import padraoImage from '../../images/projects/img-padrao.webp'

export type ProjectFeatureLevel = 'primary' | 'secondary' | false
export type ProjectLinkKind = 'repository' | 'live' | 'internal'

export interface ProjectLink {
  label: string
  url: string
  kind: ProjectLinkKind
  external: boolean
}

export interface Project {
  id: string
  name: string
  category: string
  description: string
  technologies: string[]
  technicalHighlights?: string[]
  securityHighlights?: string[]
  image?: string
  imageAlt?: string
  links: ProjectLink[]
  demo?: {
    label: string
    videoId: string
    aspectRatio: '16:9' | '9:16'
    title: string
  }
  featured: ProjectFeatureLevel
}

export const projects: Project[] = [
  {
    id: 'aylaflow',
    name: 'AylaFlow',
    category: 'SaaS de automação comercial',
    description:
      'Plataforma de automação comercial criada para ajudar empresas a manter relacionamento com sua base de clientes, recuperar oportunidades de venda e executar campanhas de forma organizada e recorrente.',
    technologies: ['Vue 3', 'TypeScript', 'NestJS', 'PostgreSQL', 'Prisma'],
    technicalHighlights: [
      'APIs REST para campanhas e integração com WhatsApp',
      'Fila persistente e processamento assíncrono por worker',
      'Idempotência, retry/backoff e abstração de provider',
    ],
    securityHighlights: [
      'Autenticação JWT',
      'Arquitetura multi-tenant com isolamento por companyId',
      'Controle de consentimento e opt-out',
      'Logs de auditoria',
    ],
    image: aylaFlowImage,
    imageAlt: 'Dashboard do AylaFlow',
    links: [
      {
        label: 'Visitar site',
        url: 'https://www.aylaflow.com.br/',
        kind: 'live',
        external: true,
      },
    ],
    featured: 'primary',
  },
  {
    id: 'hora-do-livro',
    name: 'Hora do Livro',
    category: 'Plataforma de gestão e vendas para livrarias',
    description: 'Plataforma completa para operação de livraria, integrando e-commerce, retaguarda administrativa e PDV físico. A solução permite centralizar vendas, estoque, usuários e indicadores comerciais em um único ambiente.',
    technologies: ['Vue 3', 'Firebase', 'Pinia', 'Vue Router', 'Google Authentication', 'Cloud Functions'],
    technicalHighlights: [
      'E-commerce para venda de livros',
      'Retaguarda administrativa',
      'Controle de estoque',
      'Dashboard de vendas',
      'Gerenciamento de usuários',
      'PDV para vendas presenciais',
      'Autenticação de usuários',
      'Backend serverless com Cloud Functions',
    ],
    image: horaDoLivroImage,
    imageAlt: 'Dashboard do Hora do Livro',
    links: [],
    featured: 'secondary',
  },
  {
    id: 'arcompi',
    name: 'Arcompi Compressores e Automação',
    category: 'Website institucional',
    description:
      'Presença digital desenvolvida para uma empresa do setor de ar comprimido industrial, apresentando serviços, soluções e experiência de mercado de forma profissional, responsiva e orientada à geração de novos contatos comerciais.',
    technologies: ['Vue', 'Bootstrap'],
    technicalHighlights: [
      'Interface responsiva',
      'Estrutura institucional',
      'Organização de serviços e soluções',
      'SEO',
    ],
    image: arcompiImage,
    imageAlt: 'Página do projeto Arcompi Compressores e Automação',
    links: [
      {
        label: 'Visitar site',
        url: 'https://www.luizguilhermefw.com.br/arcompi_init/home',
        kind: 'live',
        external: true,
      },
    ],
    featured: false,
  },
  {
    id: 'padrao-motores',
    name: 'Padrão Motores Elétricos',
    category: 'Website institucional',
    description:
      'Site institucional desenvolvido para fortalecer a presença digital da empresa, apresentar seus serviços especializados e facilitar o contato de clientes interessados em manutenção e soluções para motores elétricos.',
    technologies: ['PHP', 'JavaScript', 'CSS'],
    technicalHighlights: ['Layout responsivo', 'SEO'],
    image: padraoImage,
    imageAlt: 'Página do projeto Padrão Motores Elétricos',
    links: [
      {
        label: 'Visitar site',
        url: 'https://www.padraomotoreseletricos.com.br/index.php',
        kind: 'live',
        external: true,
      },
    ],
    featured: false,
  },
  {
    id: 'sintaxe-criativa',
    name: 'Blog Pessoal',
    category: 'Sintaxe Criativa',
    description:
      'Plataforma de conteúdo criada para publicação e organização de artigos, com estrutura própria para gerenciamento das publicações e evolução contínua do conteúdo.',
    technologies: ['PHP', 'MySQL', 'JavaScript'],
    technicalHighlights: ['Gerenciamento de conteúdo e painel administrativo para publicação de artigos'],
    image: blogImage,
    imageAlt: 'Página do blog Sintaxe Criativa',
    links: [
      {
        label: 'Visitar blog',
        url: '/blog',
        kind: 'internal',
        external: false,
      },
    ],
    featured: false,
  },
  {
    id: 'formula-one',
    name: 'Formula1',
    category: 'Aplicação em Flutter',
    description:
      'Projeto desenvolvido para explorar uma experiência digital dedicada ao universo da Fórmula 1, organizando conteúdos e informações do campeonato em uma interface construída em Flutter.',
    technologies: ['Flutter'],
    technicalHighlights: [
      'Interface em Flutter',
      'Navegação entre conteúdos',
      'Organização de informações do campeonato',
    ],
    image: formulaOneImage,
    imageAlt: 'Página do projeto Formula1',
    links: [
      {
        label: 'Ver código',
        url: 'https://github.com/luizguilhermefw/formula1/tree/master',
        kind: 'repository',
        external: true,
      },
    ],
    demo: {
      label: 'Ver demonstração',
      videoId: '43ASVdjLvQA',
      aspectRatio: '9:16',
      title: 'Formula1 — Demonstração',
    },
    featured: false,
  },
  {
    id: 'campanha-politica',
    name: 'Campanha Política',
    category: 'Experiência interativa · Campanha 2024',
    description:
      'Solução interativa desenvolvida para uma campanha eleitoral local, utilizando uma gameplay como formato de comunicação para ampliar o engajamento e apresentar a mensagem do candidato de maneira diferenciada.',
    technologies: [],
    technicalHighlights: ['Experiência interativa', 'Protótipo visual', 'Narrativa e interação'],
    image: campaignImage,
    imageAlt: 'Página do projeto de campanha política',
    links: [],
    demo: {
      label: 'Ver demonstração',
      videoId: 'CtvEN1cpFps',
      aspectRatio: '16:9',
      title: 'Campanha Política — Demonstração',
    },
    featured: false,
  },
]
