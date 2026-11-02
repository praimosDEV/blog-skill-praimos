# generateblog — arquivo base do blog Praimos Studio

Este é o documento-mestre. Descreve **o que é o blog, onde fica cada pasta, como cada post é fundado e estruturado** e qual é o fluxo para criar, validar e entregar. As demais pastas da skill aprofundam cada assunto:

| Pasta | Conteúdo | Ler quando |
|---|---|---|
| `SEO & copy/` | SEO, copy, copyright, afiliados, checklist de publicação | antes de escrever e antes de entregar |
| `estrutura de código/` | `html/`, `css/`, `js e json/`, `txt e md/` — código real e modelos | ao criar/editar arquivos |
| `layout/` | cores, degradês, bordas, tipografia, composição, capas, marca | ao criar capas ou mexer no visual |
| `scripts/` | `validate_blog.py`, `make_cover.py` | sempre, para validar e gerar PNG |

---

## 1. O que é o projeto
Blog estático e multilíngue (PT/EN/ES) do **Praimos Studio**: HTML + CSS + JavaScript puros, **sem build, sem framework, sem backend**. Publica análises, notícias, tutoriais, dev logs e bastidores sobre jogos e desenvolvimento. É monetizado por **links de afiliado da Instant Gaming** (`?igr=praimos`) e AdSense, então todo post precisa de SEO e de caixa de afiliado.

Recursos do sistema:
- Home com grade de posts renderizada por JS a partir de `posts.json`, filtros por categoria, "carregar mais" e destaque semanal.
- **Publicação agendada** por data + hora (`date` + `publishTime`): o post só aparece quando o horário chega.
- **Notificações**: toast + notificação nativa (com permissão) para quem está com o site aberto na hora da publicação, e aviso de "novo post" para quem volta depois.
- Troca de idioma PT/EN/ES nativa (mesmo URL), lembrada entre home e posts.
- Capas SVG próprias + PNG para redes sociais.

## 2. Estrutura de pastas do site publicado
```
/                                  ← raiz do site
├── index.html                     homepage
├── styles.css                     CSS da home
├── script.js                      render dos cards, idioma, filtros, agendamento
├── notifications.js               notificações de publicação
├── posts.json                     FONTE DE DADOS dos posts (editar este)
├── posts-data.js                  cópia embutida do posts.json (window.POSTS_DATA)
├── robots.txt
├── sitemap.xml                    uma <url> por página
├── develop.md                     guia vivo + catálogo de links de afiliado
├── imag/
│   ├── blog.png                   logo/favicon (todas as páginas)
│   ├── logo.png                   logo alternativa (reserva)
│   └── covers/
│       ├── <slug>.svg             capa exibida na página do post
│       └── <slug>.png             capa 1200×630 (og:image / twitter:image)
└── blog/
    ├── assets/
    │   ├── post.css               CSS compartilhado por todos os posts
    │   └── post.js                troca de idioma dos posts
    └── <slug>/
        └── index.html             a página de cada post
```
**Regra inegociável:** toda pasta de post vive em `blog/<slug>/`. Já houve entrega quebrada por pasta de post solta na raiz. `validate_blog.py` detecta isso.

## 3. Como um post é "fundado" (modelo mental)
Um post são **cinco artefatos** que andam juntos:
1. **Página** `blog/<slug>/index.html` (a partir de `estrutura de código/html/post-template.html`).
2. **Capa** `imag/covers/<slug>.svg` + `.png`.
3. **Entrada** em `posts.json` (+ `posts-data.js` regenerado).
4. **URL** em `sitemap.xml`.
5. **Caixa de afiliado** dentro da página (link do produto + `?igr=praimos`).

Esquecer qualquer um deles = post incompleto.

### Categorias
`devlog` Dev Log · `news` Notícias · `tutorial` Tutorial · `behind-scenes` Bastidores · `dev-analysis` DEV Análise (cores e ícones em `layout/layout.md`).

### Schema do post (`posts.json`)
Veja o bloco completo em `estrutura de código/js e json/README.md`. Campos obrigatórios: `id`, `category`, `date` (AAAA/MM/DD), `url`, `image`, `title{pt,en,es}`, `excerpt{pt,en,es}`, `tags{pt,en,es}`. Opcionais: `publishTime` (HH:MM), `isFeatured`, `featuredUntil`.

## 4. Fluxo para criar um post (passo a passo)
1. **Briefing.** Preencha/receba `estrutura de código/txt e md/briefing-post.md`. Faltou campo obrigatório? Pergunte; não invente.
2. **Pesquisa.** Fatos com fonte; para notícia recente use busca na web; separe confirmado × teoria. Se o dono passou links que você não consegue abrir, **diga isso** e baseie-se em fontes abertas.
3. **Redação** (PT) conforme `SEO & copy/copy-e-conteudo.md` e `modelo-artigo.md`; depois EN e ES **contextuais**.
4. **Capa.** Desenhe o SVG seguindo `layout/guia-de-capas.md`; gere o PNG: `python3 scripts/make_cover.py <raiz> <slug>`.
5. **Página.** Copie `post-template.html` para `blog/<slug>/index.html`, preencha todos os `{{MARCADORES}}` (`grep -c '{{'` → 0).
6. **Afiliados.** Escolha jogos pertinentes do catálogo (`SEO & copy/afiliados-e-monetizacao.md`); jogo novo → verifique a URL exata antes de usar.
7. **Dados.** Adicione a entrada ao `posts.json` (id novo = maior id + 1); regenere o `posts-data.js`:
   `{ printf 'window.POSTS_DATA = '; cat posts.json; printf ';\n'; } > posts-data.js`
8. **Sitemap.** Acrescente a `<url>` com `lastmod`.
9. **Validar:** `python3 scripts/validate_blog.py <raiz> <SITE_URL>` → `RESULTADO: OK`. Corrija até passar.
10. **Entregar** só o que mudou (ver §6).

## 5. Como refazer o blog inteiro do zero
Ordem segura (cada passo é verificável):
1. Criar a árvore de pastas da §2.
2. Copiar `css/post.css` → `blog/assets/post.css`; `css/styles.css` → `styles.css`; `js e json/post.js` → `blog/assets/post.js`; `script.js` e `notifications.js` → raiz.
3. Copiar `html/home-index.html` → `index.html` (ajustar domínio, textos, links sociais).
4. Colocar `layout/marca/blog.png` em `imag/blog.png`.
5. Criar `posts.json` vazio (`[]`) e `posts-data.js` (`window.POSTS_DATA = [];`).
6. Criar `robots.txt` e `sitemap.xml` (home) a partir de `txt e md/`.
7. Criar cada post pelo fluxo da §4.
8. Rodar `validate_blog.py`. Abrir `index.html` por um servidor local **e** direto por arquivo (o fallback `posts-data.js` deve funcionar nos dois).

## 6. Convenções de entrega (preferência do dono)
- Responder em **português**, direto, sem repetir o projeto inteiro.
- Entregar **somente arquivos novos/alterados**, num zip que **preserva os caminhos** a partir da raiz (`blog/<slug>/index.html`, `imag/covers/...`, `posts.json`, `posts-data.js`, `sitemap.xml`). Não reenviar o que não mudou.
- Não mexer em texto já aprovado quando a tarefa é outra (afiliado, SEO, data).
- Não publicar nada externo sem mostrar a versão final antes, se o dono pediu revisão.
- Sempre listar **pendências** (domínio, afiliado tangencial, data provisória, fonte que não abriu).
- Notícias sobre datas "de hoje" ou lançamentos recentes: pesquisar na web antes de escrever.

## 7. Regras que nunca se quebram
1. Pasta de post dentro de `blog/`.
2. Todo link Instant Gaming = página do produto + `?igr=praimos`; nunca `/search`.
3. Todo post tem `.ig-promo` (mesmo em tema sensível, com tom sóbrio).
4. `posts.json` ≡ `posts-data.js`.
5. Um atributo `class` por tag; um `<h1>` por idioma; logo nunca é `<h1>`.
6. Sem fato, número ou citação sem fonte; sem imagem de terceiros; citações < 15 palavras.
7. 3 idiomas completos em todo post.
8. Nunca prometer o que não existe (continuidade, parceria, segurança total).
9. Validar antes de entregar.

## 8. Erros históricos (resumo — detalhes em `txt e md/develop.md`)
Upload duplicado que sobrescreveu CSS/JS · `fetch` de JSON falhando em `file://` · cards com `opacity:0` invisíveis · `class` duplicado · dois `<h1>` · afiliado como busca · pasta de post fora de `blog/` · posts entregues sem afiliado.

## 9. Pendências conhecidas do projeto
- Confirmar o domínio: `praimos.com.br` (usado hoje) × `blog.praimos.com.br` (citado pelo dono).
- Idiomas em URLs separadas + `hreflang` (maior ganho de SEO internacional).
- Lista estática de posts (`<noscript>`) na home para descoberta sem JS.
- Política de Privacidade e aviso de cookies.
