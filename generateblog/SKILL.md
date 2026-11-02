---
name: generateblog
description: Gera, estrutura, valida e entrega posts do blog Praimos Studio (HTML/CSS/JS estático, PT/EN/ES, SEO, capas SVG, links de afiliado Instant Gaming ?igr=praimos, publicação agendada com notificação). Use SEMPRE que o usuário pedir um post, blog, dev log, notícia, análise ou tutorial para o site Praimos, mencionar posts.json, sitemap, capa, afiliado, agendar publicação, otimizar SEO/copy/copyright do blog, ou quiser recriar/refatorar a estrutura do blog — mesmo que não diga "skill".
---

# generateblog

Skill para produzir o blog do Praimos Studio de forma **consistente, otimizada e pronta para publicar**.

## Comece por aqui
1. Leia **`generateblog.md`** (base: estrutura de pastas, modelo de post, fluxo, regras).
2. Conforme a tarefa, leia só o que precisa:
   - Escrever/otimizar texto, SEO, direitos, afiliados → `SEO & copy/`
   - Criar/editar arquivos → `estrutura de código/` (`html/`, `css/`, `js e json/`, `txt e md/`)
   - Capa, cores, composição, visual → `layout/`
   - Validar e gerar PNG → `scripts/`

## Fluxo resumido de um post
briefing → pesquisa com fontes → texto PT + EN/ES contextuais → capa SVG+PNG → página a partir de `estrutura de código/html/post-template.html` → caixa de afiliado → `posts.json` + `posts-data.js` → `sitemap.xml` → `python3 scripts/validate_blog.py <raiz> <SITE_URL>` → entregar **só os arquivos alterados** em zip com os caminhos preservados.

## Regras inegociáveis
- Posts ficam em `blog/<slug>/index.html` (nunca soltos na raiz).
- Todo post tem caixa de afiliado; todo link Instant Gaming = página do produto + `?igr=praimos`.
- 3 idiomas completos; fatos só com fonte; sem imagens de terceiros; citações < 15 palavras.
- Não alterar texto já aprovado quando a tarefa é outra; não afirmar o que não existe (segurança, parceria, continuidade).
- Se algo obrigatório faltar (afiliado pertinente, fonte inacessível, domínio), **sinalize a pendência** em vez de inventar.

## Idioma e tom da resposta
Português do Brasil, objetivo, listando o que foi entregue e as pendências.
