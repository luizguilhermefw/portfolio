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
  technologyBadgeLimit?: number
  highlights?: string[]
  image?: string
  imageAlt?: string
  links: ProjectLink[]
  featured: ProjectFeatureLevel
}

export const projects: Project[] = [
  {
    id: 'aylaflow',
    name: 'AylaFlow',
    category: 'SaaS de automação comercial',
    description:
      'Plataforma SaaS para automação de comunicação e reativação de clientes, com arquitetura multi-tenant, campanhas e integração com WhatsApp.',
    technologies: ['Vue 3', 'TypeScript', 'NestJS', 'PostgreSQL', 'Prisma', 'JWT', 'REST APIs'],
    technologyBadgeLimit: 5,
    highlights: [
      'Arquitetura multi-tenant com isolamento por companyId',
      'Fila persistente e processamento assíncrono por worker',
      'Idempotência, retry/backoff e abstração de provider',
      'APIs REST com JWT, campanhas, opt-out e logs de auditoria',
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
      {
        label: 'Backend no GitHub',
        url: 'https://github.com/luizguilhermefw/client-reactivation',
        kind: 'repository',
        external: true,
      },
      {
        label: 'Frontend no GitHub',
        url: 'https://github.com/luizguilhermefw/aylaflow-frontend',
        kind: 'repository',
        external: true,
      },
    ],
    featured: 'primary',
  },
  {
    id: 'hora-do-livro',
    name: 'Hora do Livro',
    category: 'E-commerce / Plataforma de livros',
    description: 'Aplicação web voltada a livros e e-commerce, construída com Vue e Firebase.',
    technologies: ['Vue 3', 'Firebase', 'Pinia', 'Vue Router', 'Google Authentication'],
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
      'Website corporativo para uma empresa de ar comprimido industrial, com serviços, auditoria energética e área de especialistas.',
    technologies: ['PHP', 'MySQL', 'Bootstrap', 'SEO'],
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
      'Website corporativo para uma empresa especializada em manutenção de motores elétricos, com catálogo de serviços e solicitação de orçamento.',
    technologies: ['PHP', 'Responsividade', 'SEO'],
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
      'Blog pessoal com gerenciamento de conteúdo e painel administrativo para publicação de artigos sobre tecnologia.',
    technologies: ['PHP', 'MySQL', 'CMS'],
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
    category: 'Campeonato mundial',
    description:
      'Projeto web para acompanhar estatísticas, resultados e informações sobre pilotos, equipes e corridas de Fórmula 1.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
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
    featured: false,
  },
  {
    id: 'campanha-politica',
    name: 'Campanha Política',
    category: 'Website de campanha · 2024',
    description:
      'Website de campanha com propostas, agenda de eventos, canal de comunicação, galeria e notícias.',
    technologies: ['PHP', 'MySQL', 'Bootstrap'],
    image: campaignImage,
    imageAlt: 'Página do projeto de campanha política',
    links: [],
    featured: false,
  },
]
