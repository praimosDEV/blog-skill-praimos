# txt e md — arquivos de texto do projeto

| Arquivo | Função | Quando mexer |
|---|---|---|
| `develop.md` | Guia vivo do projeto: estrutura, schema, regras de afiliado, **catálogo de links verificados da Instant Gaming**, histórico de erros. | Sempre que uma convenção nascer ou um link de jogo for verificado |
| `robots.txt` | Libera o rastreamento e aponta o sitemap. | Só se o domínio mudar |
| `sitemap.xml` | Lista a home e **todos** os posts com `lastmod`. | A cada post novo |
| `briefing-post.md` | **Formulário de entrada**: o que o dono precisa informar antes de um agente escrever um post. | Copiar e preencher a cada post |
| `modelo-artigo.md` | Esqueleto editorial do texto (estrutura de seções por categoria, tom, tamanhos). | Consultar ao escrever |

## Formato do `sitemap.xml` (uma entrada por página)
```xml
<url>
  <loc>https://praimos.com.br/blog/SLUG/</loc>
  <lastmod>AAAA-MM-DD</lastmod>      <!-- data de publicação/atualização -->
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>           <!-- home = 1.0 -->
</url>
```

## `robots.txt`
```
User-agent: *
Allow: /

Sitemap: https://praimos.com.br/sitemap.xml
```
> Pendência conhecida: o dono mencionou `blog.praimos.com.br`. Se o blog ficar em subdomínio, `robots.txt`, `sitemap.xml`, canonical, og:url e JSON-LD precisam trocar de domínio **juntos**. Confirmar antes de publicar.
