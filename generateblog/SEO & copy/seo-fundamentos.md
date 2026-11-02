# SEO — fundamentos para publicar o blog na internet aberta

Objetivo: cada página nascer **indexável, compartilhável e legível por buscadores e IAs**. Tudo abaixo já está implementado no `post-template.html`; esta lista explica o porquê e como conferir.

## 1. Por página (obrigatório)
| Item | Regra | Onde |
|---|---|---|
| `<title>` | ~50–60 caracteres + ` \| Praimos Studio`. Palavra-chave principal no começo. Único no site. | `<head>` |
| meta description | 120–160 caracteres, promessa concreta, sem repetir o título. | `<head>` |
| meta keywords | Pouco peso no Google, mas mantemos PT+EN+ES (outros buscadores/IA). | `<head>` |
| Um assunto = um `<h1>` | Home: 1 `<h1>` (hero). Post: 3 `<h1>` no HTML (um por idioma, só 1 visível) — ver limitação em §4. | corpo |
| Hierarquia | `h1 → h2 → h3`, sem pular níveis. Logo e textos decorativos **não** são `<h1>`. | corpo |
| canonical | URL absoluta, com barra final, igual à do sitemap. Auto-referente. | `<head>` |
| Open Graph | `og:title`, `og:description`, `og:type=article`, `og:url`, `og:image` (**PNG 1200×630**), `og:image:alt`, `og:site_name`. | `<head>` |
| Twitter Card | `summary_large_image` + title/description/image. | `<head>` |
| JSON-LD | `Article` com headline, description, image, datePublished, dateModified, author, publisher(+logo), mainEntityOfPage, inLanguage. JSON válido. | `<head>` |
| Datas | `article:published_time` e JSON-LD no formato ISO com fuso (`-03:00`), iguais ao `date`+`publishTime` do `posts.json`. | `<head>` |
| Imagens | `alt` descritivo (não "imagem"). Capa SVG leve + PNG para social. | corpo |
| Links externos | `target="_blank" rel="noopener noreferrer"`; afiliados também `sponsored`. | corpo |

## 2. Slug e URL
- `blog/<slug>/` — minúsculo, sem acento, palavras separadas por hífen, 3–7 palavras, contendo o tema. Ex.: `crunch-por-que-continua-acontecendo`.
- Nunca mudar o slug depois de publicado (se mudar, redirecionar 301 e atualizar sitemap).
- Domínio único e consistente em **todos** os arquivos (canonical, og:url, JSON-LD, sitemap, robots). Hoje: `https://praimos.com.br`. Confirmar antes de publicar se o blog ficará em `blog.praimos.com.br`.

## 3. Nível do site
- `robots.txt` liberando tudo e apontando `Sitemap:`.
- `sitemap.xml` com home + todos os posts; atualizar a cada post; `lastmod` real.
- Enviar o sitemap no **Google Search Console** e no Bing Webmaster Tools; usar "Inspecionar URL" em cada post novo.
- Uma única tag do AdSense no `<head>` da home.
- HTTPS obrigatório; sem conteúdo misto.
- Favicon e `apple-touch-icon` apontando para `imag/blog.png`.

## 4. Limitações conhecidas (seja honesto ao otimizar)
1. **Idiomas na mesma URL:** a troca PT/EN/ES é feita por JavaScript. O Google indexa essencialmente a versão PT inicial e **`hreflang` não se aplica** a conteúdo trocado no cliente. Para ranquear em inglês/espanhol de verdade, o caminho correto é URLs separadas (`/en/blog/<slug>/`, `/es/blog/<slug>/`) com `hreflang` recíproco. É a maior evolução de SEO pendente.
2. **Cards da home são criados por JS.** O Google renderiza JS, mas o descobrimento fica dependente do sitemap. Melhoria recomendada: lista estática de links para os posts (ex.: dentro de `<noscript>` ou renderizada no build).
3. **Capas sem `width`/`height` explícitos** podem causar mudança de layout (CLS). Recomendado: `width="800" height="450"` nas `<img>` de capa.
4. **Sem `preconnect`** para fontes. Recomendado: `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`.
5. Esses itens são *evoluções*, não bloqueios para publicar.

## 5. Conteúdo que ranqueia (resumo; detalhes em `copy-e-conteudo.md`)
- Responder uma pergunta que **ainda não foi bem respondida** (ex.: "dá pra ser gamer jogando PC no celular?" rendeu mais que "dá pra jogar PC no celular?").
- Dados com fonte, datas e números verificáveis; atualizar quando mudarem.
- Linkar para fontes confiáveis e, entre posts, para temas relacionados.
- Capa e título coerentes com o conteúdo (sem clickbait que o texto não entrega).

## 6. Como testar antes de publicar
- `python3 scripts/validate_blog.py <raiz>` (estrutura, JSON-LD, canonical, sitemap, afiliados).
- Rich Results Test e Schema Markup Validator (JSON-LD).
- Facebook Sharing Debugger / LinkedIn Post Inspector / Twitter Card preview (og:image).
- Lighthouse (Performance, Acessibilidade, SEO, Boas práticas) no mobile.
