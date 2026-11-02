# Layout — identidade visual do blog

**Conceito:** tecnologia + games, **modo escuro permanente**, atmosfera de "noite com neon suave". Superfícies azul-marinho quase pretas, acento índigo→roxo, pontos de luz âmbar/verde para dar significado. Sem fotografia: a identidade vem de **ilustrações vetoriais próprias**, tipografia futurista nos títulos e muito respiro.

Os valores exatos estão em `design-tokens.css`. Exemplos de capas em `exemplos-de-capas/`; a marca em `marca/blog.png`.

## 1. Paleta
| Papel | Token | Hex | Uso |
|---|---|---|---|
| Fundo | `--bg` | `#0b0f1e` | `body` |
| Fundo alt. | `--bg-alt` | `#0f172a` | placeholder de capa (home) |
| Superfície | `--surface` | `#151b2e` | cards, caixas, janelas |
| Superfície 2 | `--surface-2` | `#1b2338` | botões, linhas internas, toast |
| Texto | `--text` | `#f1f5f9` | títulos e corpo |
| Texto suave | `--text-muted` | `#94a3b8` | datas, legendas, resumos |
| Primária | `--primary` | `#6366f1` | botões, idioma ativo, foco |
| Primária clara | `--primary-light` | `#818cf8` | hover, ícones, tags |
| Roxo | `--purple` | `#8b5cf6` | fim dos degradês, bastidores |
| Verde | `--secondary` | `#10b981` | "real", positivo, notícias |
| Âmbar | `--accent` | `#f59e0b` | destaque, avisos, tutorial |
| Vermelho | `--danger` | `#ef4444` | problema, DEV Análise |
| Corpo do artigo | — | `#dbe2ee` | parágrafos/listas do post (um pouco abaixo do branco) |

**Categorias:** devlog `#6366f1` · news `#10b981` · tutorial `#f59e0b` · behind-scenes `#8b5cf6` · dev-analysis `#ef4444` (ícones Font Awesome: code, newspaper, graduation-cap, camera, lightbulb).

Contraste: texto `#f1f5f9`/`#dbe2ee` sobre `#0b0f1e`/`#151b2e` passa AA com folga; `--text-muted` só para texto secundário ≥ 0.8rem.

## 2. Degradês
- **Texto de marca / destaque do hero:** `linear-gradient(135deg, var(--primary-light), var(--purple))` com `background-clip: text`.
- **Barra de carregamento:** `linear-gradient(90deg, var(--primary), var(--purple))`.
- **Hero (fundo):** dois `radial-gradient` — `circle at 30% 20%` com `rgba(99,102,241,.22)` e `circle at 80% 70%` com `rgba(139,92,246,.18)`, ambos para `transparent 55%`, sobre `var(--bg)`.
- **Placeholder de capa:** `linear-gradient(135deg, var(--surface-2), var(--bg-alt))`.
- **Capas SVG:** fundo `linear-gradient` diagonal `#151b2e → #0b0f1e` + brilho radial da cor-tema a 25–55 % de opacidade.
- Regra: no máximo **dois tons** por degradê; nada de arco-íris.

## 3. Bordas, raios e sombras
- Borda padrão: `1px solid var(--border)` (cinza-azulado translúcido).
- Raios: cards/caixas **16 px** · linhas/itens **10 px** · botões/chips/pílulas **20–30 px** · logo **8 px** (34 px) / **7 px** (30 px) · toast **12 px**.
- Acento lateral de 3 px (`border-left`) para avisos: `.info-box` em âmbar, `.blog-toast` em índigo.
- Card em destaque: borda âmbar.
- Sombras (sempre pretas translúcidas): card em hover `0 14px 34px rgba(0,0,0,.35)` · toast `0 16px 40px rgba(0,0,0,.45)` · janela de código `0 20px 50px rgba(0,0,0,.35)` · botão primário em hover `0 10px 24px rgba(99,102,241,.35)`.

## 4. Tipografia
- **Orbitron** (400/700/900) — logo, `h1`, `h2`, números de destaque. Dá a pegada tech/gamer.
- **Inter** (300–700) — corpo, interface.
- **Fira Code** — somente a janela de código.
- Tamanhos: título do post `clamp(1.6rem, 4vw, 2.3rem)`; hero `clamp(2.2rem, 6vw, 4rem)`; `h2` do post `1.35rem`; corpo `1rem` com `line-height: 1.7`; legenda `0.78–0.85rem`.
- Texto longo nunca em Orbitron.

## 5. Composição e espaçamento
- **Post:** barra superior fixa (logo · voltar · PT/EN/ES) → **capa em largura total, 280 px de altura** (200 px no mobile; `object-fit: cover`) → **coluna única de 780 px** com 24 px de respiro lateral → meta (categoria + data) → título → resumo → tags → corpo → caixa de afiliado → fontes.
- **Home:** hero de **100vh** com partículas → seção Blog com filtros em pílulas e **grade auto-fill `minmax(320px, 1fr)`**, gap 28 px → Projetos → Sobre (2 colunas 1.1fr/0.9fr, 1 coluna ≤ 860 px) → Contato → Rodapé. Container 1180 px.
- Espaço vertical entre seções: 60–100 px. Entre parágrafos do artigo: 18 px. Antes de `h2`: 36 px.
- Hierarquia visual: **uma** ação primária por bloco; o resto em tom secundário.

## 6. Movimento
- Transições de 0.2–0.3 s (`ease`) em hover/ativo; cards sobem 4 px no hover; setas do "ler mais" se afastam.
- Cards entram com fade + 16 px de deslocamento (0.5 s) ao rolar — **só como aprimoramento progressivo**.
- Partículas do hero: 50 pontos de 3 px que flutuam. Respeitar `prefers-reduced-motion` em novas animações.

## 7. Imagens e formatos
| Item | Formato | Medidas | Observações |
|---|---|---|---|
| Capa do post | **SVG** vetorial | `viewBox="0 0 800 450"` | ≤ 3 KB, sem imagens/fontes externas |
| Capa para redes sociais | **PNG** | **1200 × 630** | gerada da SVG com `scripts/make_cover.py`; é a `og:image` |
| Logo/favicon | PNG | quadrado | `imag/blog.png` — usada em favicon, `apple-touch-icon`, nav (34 px), loading (64 px), post (30 px) |
| Ícones | Font Awesome 6.0.0 (CDN) | — | sem SVG de ícone avulso |
| Fotografias | **não usar** | — | risco de direitos; a identidade é vetorial |
Convenção de nomes: `imag/covers/<slug>.svg` + `<slug>.png`. Texto dentro da capa: evitar (no máximo rótulos curtos como "AAA" / "INDIE").

## 8. Componentes padrão (aparência)
- **Card de post:** capa 180 px · chip de categoria colorido · data muted · título 1.15rem · resumo (3 linhas) · até 4 tags `#` em chips índigo translúcidos · "Ler mais →".
- **Seletor de idioma:** pílula `surface` com 3 botões; ativo = fundo `--primary`, texto branco.
- **Caixa de afiliado:** `surface`, borda 1px, raio 16, linhas de jogo em `surface-2` com borda que fica índigo no hover e deslocamento de 2 px.
- **Caixa de aviso (`.info-box`):** `surface` + acento lateral âmbar.
- **Toast:** canto inferior direito, `surface-2`, acento índigo, some em ~9 s.
