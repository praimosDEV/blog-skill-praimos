# CSS — como o visual é construído

| Arquivo | Usado por | Tamanho do container |
|---|---|---|
| `styles.css` | `index.html` (homepage) | 1180 px |
| `post.css` | todas as páginas `blog/<slug>/index.html` (via `../assets/post.css`) | 780 px |

Os dois arquivos usam as **mesmas variáveis** em `:root` (ver `../../layout/design-tokens.css`). Para mudar a identidade visual, altere as variáveis, não as regras.

## Mapa de classes — `post.css`
`.post-header` / `.post-header-inner` / `.post-logo-link` / `.post-logo-img` / `.back-link` / `.lang-switch` / `.lang-btn` · `.post-cover` · `.post-main` · `.post-meta` / `.post-category` / `.post-date` · `.post-title` / `.post-excerpt` / `.post-tags` / `.post-tag` · `.post-body` (h2, p, ul, strong) · `.ig-promo` (`-title`, `-sub`) / `.ig-games` / `.ig-game` (`-name`, `-note`, `-cta`) / `.ig-disclosure` · `.info-box` (aviso/destaque dentro do artigo) · `.post-sources` (`h3`, `ul`, `.note`).

## Mapa de classes — `styles.css`
Loading (`#loading-screen`, `.loading-*`) · Header (`.header`, `.navbar`, `.nav-*`, `.site-lang-*`, `.notify-toggle`) · Hero (`.hero`, `.particles`, `.particle`, `.gradient-overlay`, `.hero-title`, `.cta-button`) · Blog (`.blog-filters`, `.filter-btn`, `.blog-grid`, `.blog-card`, `.blog-image`, `.blog-cover-img`, `.blog-category`, `.blog-tags`, `.read-more`, `.load-more-btn`) · Seções (`.games-*`, `.about-*`, `.stats`, `.code-window`, `.contact-*`) · Footer · Toast (`.blog-toast`).

## Regras de CSS que NÃO podem quebrar
1. **Troca de idioma:**
   ```css
   [data-lang] { display: none; }
   [data-lang].active { display: block; }
   span[data-lang].active { display: inline; }
   li[data-lang].active { display: list-item; }   /* só em post.css */
   ```
2. **Fade-in é aprimoramento progressivo.** `.blog-card` é visível por padrão; só some se ganhar `.fade-in` (adicionada pelo JS depois de renderizar) e volta com `.visible`. Nunca ponha `opacity:0` direto em `.blog-card` — já causou posts invisíveis.
3. **Responsivo:** breakpoints em `860px` (about em 1 coluna), `768px` (menu hambúrguer, grid 1 coluna) e `600px` (toast/capa menores). Mobile-first de verdade: testar a 375 px.
4. **Sem dependências:** CSS puro, sem framework e sem build.
