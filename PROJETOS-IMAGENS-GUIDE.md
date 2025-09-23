# 📖 Guia para Adicionar Imagens dos Projetos

## 🎯 Objetivo
Este guia te ajuda a substituir os placeholders visuais por imagens reais dos seus projetos.

## 📁 Estrutura de Arquivos
```
images/
└── projects/
    ├── formula1.jpg         # Imagem do projeto Formula1
    ├── campanha.jpg         # Imagem da campanha política
    ├── padrao-motores.jpg   # Imagem do site Padrão Motores
    └── blog.jpg             # Imagem do blog
```

## 🖼️ Especificações das Imagens
- **Formato recomendado**: JPG ou PNG
- **Dimensões ideais**: 600x400px (proporção 3:2)
- **Tamanho máximo**: 500KB por imagem
- **Qualidade**: Boa resolução, mas otimizada para web

## 🔄 Como Substituir os Placeholders

### Passo 1: Adicionar suas imagens
1. Coloque suas imagens na pasta `images/projects/`
2. Nomeie os arquivos exatamente como mostrado acima

### Passo 2: Atualizar o HTML
No arquivo `index.html`, substitua os caminhos dos placeholders:

```html
<!-- Antes (placeholder) -->
<img src="images/projects/formula1-placeholder.jpg" alt="Projeto Formula1" loading="lazy">

<!-- Depois (imagem real) -->
<img src="images/projects/formula1.jpg" alt="Projeto Formula1" loading="lazy">
```

### Passo 3: Remover CSS de placeholders
Após adicionar todas as imagens reais, você pode:
1. Remover o arquivo `projeto-placeholders.css`
2. Remover a linha do HTML: `<link rel="stylesheet" href="projeto-placeholders.css">`

## 🎨 Dicas para Melhores Imagens
1. **Screenshots de tela**: Capture a página principal do projeto
2. **Mockups**: Use ferramentas como Canva para criar mockups profissionais
3. **Logos/ícones**: Adicione o logo da tecnologia usada no canto
4. **Consistência**: Mantenha o mesmo estilo visual em todas as imagens

## 📱 Otimização
- Use ferramentas como TinyPNG para comprimir as imagens
- Considere usar formato WebP para melhor performance
- Adicione atributo `loading="lazy"` (já incluído)

## 🚀 Resultado
Após seguir estes passos, sua seção de projetos terá:
- ✅ Imagens reais dos projetos
- ✅ Design moderno e responsivo
- ✅ Animações suaves
- ✅ Cards interativos
- ✅ Tags de tecnologias
- ✅ Botões de ação estilizados