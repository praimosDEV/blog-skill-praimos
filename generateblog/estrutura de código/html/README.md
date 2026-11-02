# HTML — como as páginas são montadas

## Arquivos desta pasta
| Arquivo | O que é |
|---|---|
| `home-index.html` | A **homepage real** (cópia do `index.html` da raiz). Referência de todas as seções. |
| `post-template.html` | Modelo de **página de post** com `{{MARCADORES}}`. Vira `blog/<slug>/index.html`. |

## Homepage (`index.html`) — ordem das seções
1. `<head>`: SEO completo (title, description, keywords, Open Graph, Twitter Card, canonical, favicon `imag/blog.png`, JSON-LD `Organization` + `WebSite`), AdSense (1 única tag), fontes (Inter + Orbitron), Font Awesome.
2. `#loading-screen` — tela de carregamento (some após 2 s; cobre qualquer "flash" de conteúdo antes do JS rodar).
3. `<header class="header">` — logo (img + texto, **sem `<h1>`**), links de navegação, seletor de idioma `.site-lang-btn` (PT/EN/ES), sino `#notify-toggle`.
4. `#home` hero — **o único `<h1>` da página**.
5. `#blog` — filtros `.filter-btn[data-filter]`, `#blog-grid` (cards são criados pelo JS), botão `#load-more`.
6. `#games`, `#about` (contador `#blog-count` preenchido pelo JS), `#contact`, `<footer>`.
7. Scripts, **nesta ordem**: `posts-data.js` → `script.js` → `notifications.js`.

## Página de post — anatomia obrigatória (ver `post-template.html`)
1. `<head>`: title · description (120–160 caracteres) · keywords · og:* (com `og:image` apontando para o **PNG**) · twitter:* · canonical · favicon `../../imag/blog.png` · JSON-LD `Article` · fontes · `../assets/post.css`.
2. `.post-header`: logo (`post-logo-link`) + "voltar ao blog" + `.lang-switch` (PT/EN/ES).
3. `.post-cover`: `<img>` da capa SVG.
4. `.post-main > .container`: `.post-meta` (categoria + data) → 3× `<h1 data-lang>` → 3× `.post-excerpt` → 3× `.post-tags` → 3× `.post-body` → `.ig-promo` → `.post-sources`.
5. `<script>window.PAGE_META = {pt,en,es}</script>` + `<script src="../assets/post.js">`.

## Sistema de idiomas (regra de ouro)
- Todo texto visível existe **3 vezes**, cada cópia com `data-lang="pt|en|es"`.
- O CSS esconde `[data-lang]` e mostra `[data-lang].active`. Quem põe/tira `.active` é o JS (`post.js` nos posts, `script.js` na home).
- **Um único atributo `class` por tag.** Errado: `<h2 class="x" data-lang="pt" class="active">`. Certo: `<h2 class="x active" data-lang="pt">`.
- Tradução **contextual**, não literal: adapte expressões, mantenha fatos e números idênticos nos 3 idiomas.

## Marcadores do `post-template.html`
`SLUG` · `SITE_URL` · `TITLE_PT/EN/ES` (+ `_CURTO` para `<title>`) · `DESCRIPTION_*` · `KEYWORDS_*` · `EXCERPT_*` · `TAG1..5_*` · `AAAA-MM-DD` · `HH:MM` · `DD/MM/AAAA` · `CATEGORIA_EXIBIDA` · `ALT_DA_CAPA` · corpo `*_PT/EN/ES` · caixa de afiliado (`TITULO_CAIXA_*`, `ID-SLUG-DO-PRODUTO`, `NOME_DO_JOGO`, `ESTUDIO`) · fontes (`URL_DA_FONTE`, `VEICULO`, `TITULO_DA_MATERIA`, `NOTA_*`).
Depois de preencher: `grep -c '{{' blog/<slug>/index.html` deve imprimir `0`.

## Erros históricos a evitar
- Pasta de post fora de `blog/`.
- `class` duplicado numa tag.
- Dois `<h1>` na home (logo/loading não são `<h1>`).
- Link de afiliado sem `?igr=praimos` ou apontando para `/search`.
