# Praimos Studio — Guia de Desenvolvimento do Blog

Documento de referência pra manter consistência entre atualizações. Qualquer
mudança feita no blog (novo post, novo campo, nova funcionalidade) deveria
seguir isso — e esse arquivo deveria ser atualizado sempre que uma convenção
nova for criada.

---

## 1. Estrutura de pastas (raiz do site)

```
/
├── index.html              ← homepage (grid de posts, seção sobre, contato)
├── styles.css               ← CSS da homepage
├── script.js                 ← lógica da homepage (render de posts, idioma, filtros)
├── notifications.js          ← sistema de notificação de publicação agendada
├── posts.json                 ← fonte de dados dos posts (editar este arquivo)
├── posts-data.js              ← MESMO conteúdo de posts.json, embutido como
│                                  `window.POSTS_DATA` — serve de fallback
│                                  quando fetch('./posts.json') falha (ex:
│                                  abrir o index.html direto via file://).
│                                  SEMPRE regenerar depois de editar posts.json:
│
│                                  { printf 'window.POSTS_DATA = '; cat posts.json; printf ';\n'; } > posts-data.js
│
├── robots.txt
├── sitemap.xml                 ← toda vez que um post for criado, adicionar <url> aqui
├── develop.md                   ← este arquivo
├── imag/
│   ├── blog.png                  ← logo/favicon do site (usado em TODAS as páginas)
│   ├── logo.png                  ← logo alternativa (hoje não usada em lugar nenhum)
│   └── covers/
│       ├── <slug-do-post>.svg     ← capa vetorial (usada na página do post)
│       └── <slug-do-post>.png     ← mesma capa, rasterizada 1200x630 (usada em
│                                      og:image/twitter:image — redes sociais
│                                      não garantem renderizar SVG em preview)
└── blog/
    ├── assets/
    │   ├── post.css                ← CSS compartilhado por TODAS as páginas de post
    │   └── post.js                 ← troca de idioma (PT/EN/ES) compartilhada
    └── <slug-do-post>/
        └── index.html                ← a página do post em si

```

**⚠️ ERRO JÁ COMETIDO UMA VEZ — não repetir:** toda pasta de post individual
**tem** que ficar dentro de `blog/`. Ex.: `blog/nome-do-post/index.html`,
nunca `nome-do-post/index.html` solto na raiz. Isso já causou um pacote de
entrega quebrado numa atualização anterior.

---

## 2. Como criar um post novo — checklist

1. **Escolher o slug** (nome da pasta): minúsculo, sem acento, palavras
   separadas por hífen. Ex.: `crunch-por-que-continua-acontecendo`.
2. **Criar a capa**: SVG abstrato no estilo visual do site (paleta abaixo),
   salvo em `imag/covers/<slug>.svg`, depois rasterizado pra PNG 1200×630 em
   `imag/covers/<slug>.png` (usar `cairosvg`, `pip install cairosvg --break-system-packages`).
   **Evitar capturas de tela reais de jogos ou personagens licenciados** —
   risco de direito autoral. Preferir ilustração vetorial própria.
3. **Criar `blog/<slug>/index.html`**: copiar a estrutura de um post existente
   (ver seção 4) e adaptar.
4. **Adicionar a entrada em `posts.json`** (ver schema na seção 3).
5. **Regenerar `posts-data.js`** a partir do `posts.json` atualizado (comando
   na seção 1).
6. **Adicionar `<url>` no `sitemap.xml`**, com `lastmod` igual à data de
   publicação.
7. **Validar antes de entregar** (ver seção 6).

---

## 3. Schema de `posts.json`

```jsonc
{
    "id": 8,                              // único, incremental — nunca reutilizar
    "category": "dev-analysis",            // ver tabela de categorias abaixo
    "date": "2026/10/19",                  // formato AAAA/MM/DD
    "publishTime": "10:00",                // HH:MM 24h — opcional; se omitido, publica à meia-noite
    "url": "blog/<slug>/",                 // SEMPRE dentro de blog/, com barra no final
    "image": "imag/covers/<slug>.svg",     // capa usada no card da home
    "title":   { "pt": "...", "en": "...", "es": "..." },
    "excerpt": { "pt": "...", "en": "...", "es": "..." },
    "tags":    { "pt": [...], "en": [...], "es": [...] }
}
```

`date` + `publishTime` juntos formam o momento exato de publicação — o post
só aparece no site (e só dispara notificação) quando esse instante chegar.
Isso já é tratado por `getPublishDateTime()` / `isPostPublished()` no
`script.js` e por `notifications.js`; **não precisa mexer em nenhum dos dois**
pra publicar um post novo, só adicionar a entrada certa em `posts.json`.

### Categorias disponíveis (não inventar uma nova sem atualizar `script.js`)

| category        | Nome exibido (PT) | Cor       |
|------------------|--------------------|-----------|
| `devlog`         | Dev Log            | `#6366f1` |
| `news`           | Notícias           | `#10b981` |
| `tutorial`       | Tutorial           | `#f59e0b` |
| `behind-scenes`  | Bastidores         | `#8b5cf6` |
| `dev-analysis`   | DEV Análise        | `#ef4444` |

---

## 4. Estrutura de uma página de post (`blog/<slug>/index.html`)

Seções obrigatórias, nessa ordem:

1. **`<head>`**: title, meta description, meta keywords, Open Graph completo
   (`og:title`, `og:description`, `og:type=article`, `og:url`, `og:image`
   apontando pro **PNG**, `og:image:alt`, `og:site_name`,
   `article:published_time`, `article:author`), Twitter Card
   (`twitter:card=summary_large_image` + title/description/image),
   `<link rel="canonical">`, favicon (`../../imag/blog.png`), JSON-LD
   `Article` (ver exemplo em qualquer post já publicado), fontes e
   `../assets/post.css`.
2. **`<header class="post-header">`**: logo (`post-logo-link` + `post-logo-img`,
   apontando pra `imag/blog.png`) + link "voltar ao blog" + seletor PT/EN/ES.
3. **`.post-cover`**: a imagem SVG da capa.
4. **`.post-main`**: categoria + data, depois título/excerpt/tags em 3 blocos
   `data-lang="pt|en|es"` (o `pt` leva `class="active"` por padrão), depois o
   corpo do artigo também em 3 blocos `.post-body[data-lang]`.
5. **`.ig-promo`** (opcional, mas recomendado quando fizer sentido pro tema):
   caixa com 2–4 jogos relacionados, linkando pra Instant Gaming.
6. **`.post-sources`**: fontes reais usadas na pesquisa, com link e nota de
   data.
7. **`<script>` com `window.PAGE_META`** (title/description por idioma, usado
   pela troca de idioma pra atualizar `<title>` e a meta description) +
   `<script src="../assets/post.js">`.

O mecanismo de troca de idioma é inteiramente dirigido por `data-lang` + a
classe `.active` (ver `blog/assets/post.js` e `blog/assets/post.css`) — não
precisa (e não deve) duplicar essa lógica dentro da página do post.

---

## 5. Links de afiliado Instant Gaming — regra fixa

**Todo link da Instant Gaming tem que terminar em `?igr=praimos`.** Sem
exceção. Esse é o lembrete recorrente do dono do projeto porque já é fácil
esquecer numa correção rápida — ao editar qualquer link de jogo, sempre
conferir se o `?igr=praimos` continua lá no final.

Regras adicionais:
- **Sempre usar link direto do produto** (`instant-gaming.com/en/<id>-buy-<nome>-pc-...`),
  nunca link de busca (`/en/search/?query=...`) — já foi pedido explicitamente
  pra evitar isso.
- **Verificar que a página existe de verdade** antes de usar (buscar
  `site:instant-gaming.com <nome do jogo>` e conferir a URL exata — IDs de
  produto não são previsíveis).
- Incluir a frase de divulgação de afiliado (já traduzida nos 3 idiomas) logo
  abaixo da caixa de jogos — isso já está no template, só manter.
- **TODO post precisa ter ao menos uma caixa `.ig-promo`.** Os links de
  afiliado sustentam o domínio e a criação dos blogs — um post sem eles é um
  post incompleto. Em temas sensíveis (crunch, luto) a caixa continua
  obrigatória, só muda o enquadramento: ligar ao tema de forma sóbria (ex.: no
  post do Diogo Moraes, o link é do próprio jogo 171; no de crunch, "times
  pequenos, jogos grandes"). Nunca omitir.
- **Nunca alterar o texto do artigo ao adicionar/ajustar afiliados** — a caixa
  entra entre o último `.post-body` e o `.post-sources`.
- **Auditoria antes de entregar** (deve imprimir vazio):
  `grep -rhoE 'href="https://www\.instant-gaming\.com[^"]*"' --include="*.html" . | grep -v 'igr=praimos"'`

### Catálogo de links verificados (usar estes; sempre + `?igr=praimos`)

Base: `https://www.instant-gaming.com/en/` + o caminho abaixo + `?igr=praimos`

| Jogo | Caminho |
|------|---------|
| Cyberpunk 2077 | `840-buy-cyberpunk-2077-pc-game-gog-com/` |
| Starfield | `2675-buy-starfield-pc-game-steam/` |
| Baldur's Gate 3 | `4804-buy-baldur-s-gate-3-pc-game-gog-com/` |
| Red Dead Redemption 2 | `5679-buy-red-dead-redemption-2-pc-game-rockstar/` |
| GTA V Enhanced | `4211-buy-grand-theft-auto-v-enhanced-pc-rockstar/` |
| GTA V Enhanced + Great White Shark Card | `1804-buy-grand-theft-auto-v-enhanced-and-great-white-shark-card-pc-rockstar/` |
| Hades | `5972-buy-hades-pc-mac-game-steam/` |
| Hollow Knight | `2198-buy-hollow-knight-pc-mac-game-steam/` |
| Hollow Knight: Silksong | `3952-buy-hollow-knight-silksong-pc-mac-steam/` |
| Celeste | `8003-buy-celeste-pc-mac-game-steam/` |
| Forager | `4460-buy-forager-pc-game-steam/` |
| LEGO Batman: The Videogame | `1605-buy-lego-batman-the-videogame-pc-game-steam/` |
| LEGO Batman Trilogy | `1665-buy-lego-batman-trilogy-pc-game-steam/` |
| No Man's Sky | `414-buy-no-man-s-sky-pc-mac-steam/` |
| Minecraft: Java & Bedrock | `12567-buy-minecraft-java-and-bedrock-edition-pc/` |
| Minecraft Dungeons II (Deluxe) | `22155-buy-minecraft-dungeons-ii-deluxe-edition-pc-xbox-series-x-s-microsoft-store/` |
| 171 (Betagames Group) | `13216-buy-171-pc-game-steam/` |

Jogo novo? Buscar `site:instant-gaming.com "<nome>" buy PC`, confirmar a URL
exata e acrescentar nesta tabela.

---

## 6. Validação obrigatória antes de entregar qualquer atualização

Rodar sempre, pros arquivos tocados:

```bash
# JSON válido
python3 -c "import json; json.load(open('posts.json')); print('OK')"

# sitemap válido
python3 -c "import xml.dom.minidom as m; m.parse('sitemap.xml'); print('OK')"

# HTML sem tags desbalanceadas (rodar pra cada index.html tocado)
python3 - "<arquivo>" <<'EOF'
import sys, html.parser
class P(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(); self.stack=[]
        self.voidels={'meta','link','img','br','input','hr','source','area'}
    def handle_starttag(self, tag, attrs):
        if tag not in self.voidels: self.stack.append(tag)
    def handle_endtag(self, tag):
        if self.stack and self.stack[-1]==tag: self.stack.pop()
p=P(); p.feed(open(sys.argv[1],encoding='utf-8').read())
print(sys.argv[1], "-> open tags left:", p.stack)
EOF

# JSON-LD válido (regex simples pra extrair e validar cada bloco <script type="application/ld+json">)
python3 - <<'EOF'
import re, json
content = open("<arquivo>", encoding='utf-8').read()
for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', content, re.S):
    json.loads(b)
print("OK")
EOF
```

Se o ambiente tiver Node + jsdom disponíveis, idealmente também simular o
carregamento da home (`posts-data.js` → `script.js` → `notifications.js`) pra
pegar erro de runtime antes de entregar — já foi útil pra achar bug real mais
de uma vez neste projeto.

**Antes de empacotar qualquer entrega, conferir a estrutura final do zip**
(`find <pasta> -type f`) e garantir que cada página de post está dentro de
`blog/<slug>/`, não solta na raiz.

---

## 7. Erros já cometidos neste projeto (não repetir)

Histórico real de bugs encontrados e corrigidos, mantido aqui pra não cair
nos mesmos de novo:

1. **Upload duplicado sobrescrevendo arquivo errado**: `script.js`,
   `styles.css` e `index.html` foram enviados duas vezes cada (de páginas
   diferentes) no início do projeto; o upload duplicado sobrescreveu os
   arquivos certos pelos errados, e o `styles.css` original da homepage foi
   perdido de vez (precisou ser reconstruído do zero).
2. **`fetch('./posts.json')` falha sob `file://`**: abrir o `index.html`
   direto no navegador (sem servidor) bloqueia o fetch por CORS. Resolvido
   com o fallback pra `posts-data.js` (`window.POSTS_DATA`) — por isso os
   dois arquivos sempre precisam estar sincronizados.
3. **`.blog-card { opacity: 0 }` sem nunca virar visível**: o
   `IntersectionObserver` que revela os cards rodava uma única vez, antes dos
   cards existirem (eles só são criados depois do fetch assíncrono). Corrigido
   fazendo `.blog-card` visível por padrão e só escondendo via `.fade-in`
   quando o observer realmente é anexado (depois do render).
4. **Atributo `class` duplicado em HTML** (`<h2 class="x" data-lang="pt" class="active">`)
   ao adicionar idiomas na home — navegadores ignoram o segundo `class`,
   quebrando a visibilidade. Sempre usar `class="x active"` (um atributo só).
5. **Dois `<h1>` na mesma página** (logo + título) — ruim pra SEO. Logo e
   texto decorativo devem usar `<span>`/`<p>`, nunca `<h1>`; só o título real
   da página deveria ser `<h1>`.
6. **Links de afiliado como busca, não produto direto** — já corrigido uma
   vez; ver regra fixa na seção 5.
8. **Posts entregues sem caixa de afiliado** (Minecraft/The Sift, Diogo Moraes e
   Crunch) — corrigido depois; ver regra da seção 5.
7. **Pacote de entrega com pastas de post fora de `blog/`** — este mesmo
   erro, cometido na entrega da leva de 3 posts (No Man's Sky, Speedrun,
   Crunch). Ver checklist de empacotamento na seção 6.

---

## 8. Convenções de conteúdo

- Todo post leva **PT, EN e ES completos** — não publicar parcial.
- Fontes reais na seção final, com link clicável e nota de quando o dado foi
  coletado — nunca inventar número ou fato.
- Tom do "Praimos Studio" nos posts de análise: trazer a perspectiva de
  estúdio pequeno no final, quando fizer sentido (ex.: "o que isso significa
  pra quem não tem orçamento de Rockstar").
- Categoria `dev-analysis` é a mais usada até agora; variar categoria quando
  o tema permitir (dá mais variedade visual na home).
