# Checklist de publicação (marque tudo antes de entregar)

## Conteúdo
- [ ] Ângulo definido e título/excerpt nos 3 idiomas
- [ ] Todo fato com fonte na seção final; nada inventado
- [ ] Confirmado × teoria × estimativa separados
- [ ] Citações < 15 palavras, uma por fonte
- [ ] PT, EN e ES equivalentes (números/nomes/datas iguais)
- [ ] Tema sensível? Tom sóbrio, sem especulação
- [ ] Texto aprovado pelo dono não foi alterado sem pedido

## Arquivos e estrutura
- [ ] Pasta do post em **`blog/<slug>/index.html`** (não solta na raiz)
- [ ] Capa `imag/covers/<slug>.svg` **e** `.png` (1200×630)
- [ ] Entrada nova em `posts.json` (id novo, `date`, `publishTime`, `url`, `image`, title/excerpt/tags × 3)
- [ ] `posts-data.js` regenerado a partir do `posts.json`
- [ ] `sitemap.xml` com a URL nova e `lastmod`
- [ ] Nenhum `{{MARCADOR}}` sobrando: `grep -c '{{' blog/<slug>/index.html` → 0

## SEO
- [ ] title (~60), description (120–160), canonical, og:*, twitter:*, JSON-LD
- [ ] Datas iguais em: `.post-date`, `article:published_time`, JSON-LD (×2), `posts.json`
- [ ] Domínio idêntico em todos os arquivos
- [ ] alt na capa; um assunto por página

## Monetização
- [ ] `.ig-promo` presente com jogos pertinentes
- [ ] Todo link `...?igr=praimos`, página do produto, `rel="... sponsored"`
- [ ] Frase de divulgação nos 3 idiomas

## Validação automática
```bash
python3 scripts/validate_blog.py <raiz-do-site> https://praimos.com.br   # deve imprimir RESULTADO: OK
```

## Entrega
- [ ] Entregar **só os arquivos novos/alterados**, preservando os caminhos (`blog/<slug>/...`, `imag/covers/...`) em um zip
- [ ] Publicação externa? Mostrar a versão final ao dono **antes**
- [ ] Pendências (domínio, afiliado tangencial, data provisória) listadas na resposta

## Depois de publicar
- [ ] Search Console: inspecionar a URL e solicitar indexação; reenviar sitemap
- [ ] Testar og:image nos debuggers (Facebook/LinkedIn/X)
- [ ] Conferir no celular (375 px) e em PT/EN/ES
- [ ] Abrir os links de afiliado e checar se a página do produto carrega
