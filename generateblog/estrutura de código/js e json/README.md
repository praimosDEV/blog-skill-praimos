# JS e JSON — fluxo de dados e funções

## Pasta extra (não pedida originalmente, mas indispensável)
O blog não funciona só com HTML+CSS: o JS desenha os cards, troca idiomas e agenda publicações. Por isso esta pasta existe.

## Fluxo da homepage
```
posts.json  ──(fonte única, editada à mão)
    │  { printf 'window.POSTS_DATA = '; cat posts.json; printf ';\n'; } > posts-data.js
    ▼
posts-data.js  (cópia embutida: fallback quando fetch falha, ex.: abrir via file://)
    ▼
script.js  loadBlogPosts(): tenta fetch('./posts.json'); se falhar usa window.POSTS_DATA
    ▼
renderBlogPosts(): filtra publicados → ordena por data/hora → filtro de categoria →
                   destaque → fatia por postsLoaded (3 + "carregar mais") → cria cards
    ▼
observeFadeIns('.blog-card')  (DEPOIS de inserir os cards)
    ▼
notifications.js  espera blogPosts carregar → avisa de posts novos desde a última visita
                  e agenda setTimeout para o próximo horário de publicação
```
**`posts.json` e `posts-data.js` precisam ter conteúdo idêntico.** `scripts/validate_blog.py` confere isso.

## Schema de um post (`posts.json`)
```jsonc
{
  "id": 11,                        // único, incremental, nunca reutilizar
  "category": "dev-analysis",      // devlog | news | tutorial | behind-scenes | dev-analysis
  "date": "2026/10/29",            // AAAA/MM/DD
  "publishTime": "17:00",          // HH:MM (24h). Omitido = 00:00
  "url": "blog/<slug>/",           // sempre dentro de blog/, com barra final
  "image": "imag/covers/<slug>.svg",
  "title":   { "pt": "", "en": "", "es": "" },
  "excerpt": { "pt": "", "en": "", "es": "" },
  "tags":    { "pt": [], "en": [], "es": [] },
  "isFeatured": false,             // opcional
  "featuredUntil": "2026/11/05"    // opcional (AAAA/MM/DD)
}
```
Publicação = `date` + `publishTime` no relógio do **navegador do leitor**. Antes disso o post não aparece, não conta em "Blog Posts" e não notifica.

## Funções-chave de `script.js`
`loadBlogPosts` · `getPublishDateTime(post)` · `isPostPublished(post, now)` · `renderBlogPosts` · `createBlogPostElement` (categoryColors/categoryNames/ícones) · `setSiteLang(lang)` · `initLanguage` · `observeFadeIns(selector)` · `loadMorePosts` · `scrollToSection`.

## `notifications.js`
Chaves do `localStorage`: `praimos-blog-lang` (idioma, compartilhado com os posts), `praimos-last-visit`, `praimos-notified-posts`. Na 1ª visita nada é notificado. Toast na página sempre funciona; notificação nativa só após o clique no sino (`#notify-toggle`, exige gesto do usuário). **Só funciona com o navegador aberto** — push com navegador fechado exigiria backend + Service Worker.

## `post.js`
Aplica `.active` nos `[data-lang]`, marca o botão de idioma, atualiza `<html lang>`, `document.title` e a meta description a partir de `window.PAGE_META`, e lembra a escolha em `localStorage`.

## Para adicionar uma categoria nova
Editar **três** lugares: `categoryColors`, `categoryNames` e `getBlogIcon` em `script.js`; adicionar um `.filter-btn[data-filter]` em `index.html`; e o rótulo exibido nos posts (`.post-category`). Registrar a cor em `layout/layout.md`.
