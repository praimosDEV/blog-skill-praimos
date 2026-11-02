# Afiliados e monetização (Instant Gaming + AdSense)

Os links de afiliado e o AdSense **sustentam o domínio e a criação dos blogs**. Um post sem caixa de afiliado é um post incompleto.

## Regras fixas
1. **Todo post tem uma caixa `.ig-promo`** com 1–5 jogos. Em temas sensíveis a caixa continua obrigatória, mas com enquadramento sóbrio (ex.: no post de homenagem, o link é do jogo da pessoa; no de crunch, "times pequenos, jogos grandes").
2. **Todo link termina em `?igr=praimos`** — sem exceção. Formato:
   `https://www.instant-gaming.com/en/<ID>-buy-<nome>.../?igr=praimos`
3. **Sempre a página do produto**, nunca `/en/search/?query=...`.
4. **Verificar que a URL existe** (`site:instant-gaming.com "<jogo>" buy PC`) e copiar a URL exata — o ID não é previsível. Registrar no catálogo.
5. Jogos **pertinentes ao tema**. Se nada for pertinente, não invente relação: use a caixa discreta (ex.: "pra a pausa depois do deploy") e **sinalize ao dono** que o link é tangencial.
6. Frase de divulgação nos 3 idiomas logo abaixo da caixa.
7. Não alterar o texto do artigo ao adicionar/ajustar afiliados.

## Auditoria (deve imprimir vazio)
```bash
grep -rhoE 'href="https://www\.instant-gaming\.com[^"]*"' --include="*.html" . | grep -v 'igr=praimos"'
grep -rhoE 'instant-gaming\.com/en/search[^"]*' --include="*.html" .
```
(`scripts/validate_blog.py` já faz as duas verificações.)

## Catálogo de links verificados
Base: `https://www.instant-gaming.com/en/` + caminho + `?igr=praimos`

| Jogo | Caminho |
|---|---|
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

Observação: estoque e preço mudam; uma página pode aparecer "esgotada". Ofereça sempre 2–3 opções por caixa.

## AdSense
- Uma única tag `adsbygoogle.js` no `<head>` da home (a duplicada já foi removida).
- Manter conteúdo original e útil; não colocar anúncio que imite botão do site.
- Política de privacidade publicada (ver `copyright-e-direitos.md` §6).
