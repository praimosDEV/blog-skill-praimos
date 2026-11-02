# blog-skill-praimos

Skill do **Praimos Studio** para criar, revisar e validar posts de blog em português, inglês e espanhol. Reúne orientações editoriais, SEO, capas, afiliados e modelos de um blog estático em HTML, CSS e JavaScript.

O repositório distribui a skill; a pasta `generateblog/` contém as instruções e os recursos fornecidos no pacote original. Seu nome interno continua sendo `generateblog`.

## Downloads

- [Release v1.0.0 e pacote da skill](https://github.com/praimosDEV/blog-skill-praimos/releases/tag/v1.0.0)
- [Baixar pacote ZIP da skill](https://github.com/praimosDEV/blog-skill-praimos/releases/download/v1.0.0/blog-skill-praimos-v1.0.0.zip)
- [Baixar código completo do repositório](https://github.com/praimosDEV/blog-skill-praimos/archive/refs/heads/main.zip)

## Instalação e uso

1. Baixe e extraia o ZIP da Release.
2. Copie a pasta `generateblog/`, incluindo todos os arquivos, para o diretório de skills aceito pelo seu agente. A entrada da skill é `generateblog/SKILL.md`.
3. Se o agente não oferecer instalação de skills, forneça `SKILL.md`, `generateblog.md` e os recursos pertinentes como contexto.
4. Informe o tema, objetivo, público, fontes, domínio do site e data de publicação. Use o modelo `estrutura de código/txt e md/briefing-post.md`.
5. Revise texto, traduções, capa e links antes de publicar no seu site.

Exemplo de pedido:

```text
Use a skill generateblog para preparar um tutorial para o blog Praimos Studio.
Tema: [tema]. Público: [público]. Domínio: [URL].
Entregue PT/EN/ES, capas, arquivos do post e atualizações de dados e sitemap.
Use fontes verificáveis e liste as pendências antes da publicação.
```

## Conteúdo

| Caminho em `generateblog/` | Conteúdo |
| --- | --- |
| `SKILL.md` | Entrada da skill, fluxo resumido e referências. |
| `generateblog.md` | Documento mestre: estrutura do site e processo de produção. |
| `SEO & copy/` | SEO, redação, direitos, afiliados e checklist. |
| `estrutura de código/` | Modelos HTML/CSS/JS, dados e briefing. |
| `layout/` | Identidade visual, tokens, marca e exemplos de capas. |
| `scripts/validate_blog.py` | Validação dos arquivos de um site montado. |
| `scripts/make_cover.py` | Conversão de capa SVG para PNG 1200 × 630. |

## Fluxo de trabalho

Briefing → pesquisa → redação PT/EN/ES → capas → página em `blog/<slug>/index.html` → links de afiliado → atualização de `posts.json` e `posts-data.js` → sitemap → validação → entrega.

Os modelos incluem convenções específicas do Praimos Studio, como o identificador de afiliado `igr=praimos`, identidade visual e endereços de exemplo. Confirme esses dados ao adaptar o material para outro site. O pacote contém modelos e referências; não representa um blog completo pronto para implantação.

## Scripts

Execute os comandos a partir da pasta `generateblog/`, com Python 3 disponível:

```sh
python scripts/validate_blog.py /caminho/do/site https://seu-dominio.example
```

O validador precisa da raiz do **site montado**, com páginas, capas e dados. Ele não deve ser executado sobre a pasta da skill como se ela fosse o site.

Para converter uma capa SVG em PNG, instale CairoSVG no seu ambiente Python e execute:

```sh
python -m pip install cairosvg
python scripts/make_cover.py /caminho/do/site slug-do-post
```

A conversão depende também de uma instalação de Cairo compatível com o sistema operacional.

## Agendamento e notificações

Nos modelos fornecidos, a visibilidade dos posts é calculada no navegador do visitante a partir de data e hora. As notificações dependem de o site estar aberto e, para notificações nativas, da permissão do usuário. Isso não constitui um serviço de publicação no servidor nem push com o navegador fechado.

## Versão inicial

A Release `v1.0.0` identifica a primeira distribuição neste repositório. Os 35 arquivos da pasta `generateblog/` foram preservados a partir do `skill.zip` fornecido, sem alterar suas instruções ou recursos.
