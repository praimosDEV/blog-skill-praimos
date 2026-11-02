# Guia de arte das capas (SVG → PNG)

## Receita
1. Canvas `viewBox="0 0 800 450"`.
2. **Fundo:** `linearGradient` (0,0)→(1,1) de `#151b2e` para `#0b0f1e`.
3. **Brilho opcional:** `radialGradient` na cor-tema, 25–55 % de opacidade, atrás do elemento principal.
4. **Elemento principal (metáfora do tema):** formas geométricas simples, preenchimento `#1b2338`, contorno `#334155` de 2–3 px.
5. **Pontos de significado:** âmbar `#f59e0b` = foco/atenção · verde `#10b981` = real/positivo · vermelho `#ef4444` = problema/ruptura · índigo/roxo = marca.
6. **Partículas:** 4–8 círculos (r 2–4) em `#8b5cf6`/`#818cf8`/branco, opacidade 0.3–0.6, nas bordas.
7. Salvar em `imag/covers/<slug>.svg`; gerar o PNG: `python3 scripts/make_cover.py <raiz> <slug>`.
8. Conferir: abre sem fontes/imagens externas, ≤ 3 KB, PNG 1200×630, `alt` escrito.

## Metáforas já usadas (veja `exemplos-de-capas/`)
| Tema | Metáfora |
|---|---|
| IA generativa | rede neural: nós índigo ligados por linhas, um nó âmbar |
| Orçamento AAA × indie | barras grandes (índigo) × barras pequenas (verde) com moedas |
| Crunch | relógio com ponteiros além da meia-noite + monitor calmo, tom sóbrio |
| Redenção (No Man's Sky) | anel quebrado vermelho → seta âmbar → planeta pleno |
| Speedrun | cronômetro com arco âmbar e linhas de velocidade |
| Minecraft / The Sift | moldura de blocos + portal rosa/turquesa + blocos flutuando |
| Homenagem (Diogo Moraes) | skyline apagada + vela âmbar, tudo contido |
| SaaS / dashboard (Nexus) | janela com cartões, barras e linha esperado × real |
| Celular + PC | torre de PC → ondas → smartphone |

## Proibido
Logos, personagens, texturas, mobs, capturas de tela e arte oficial de jogos ou empresas; fotos de pessoas; texto longo. Use **substitutos genéricos** (cubos, blobs, silhuetas).

## Temas sensíveis
Paleta contida (sem brilho forte), poucos elementos, um único ponto de luz quente (ex.: vela), sem partículas chamativas.
