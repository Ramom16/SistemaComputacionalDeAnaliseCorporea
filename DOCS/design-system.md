# 🎨 IronFIT — Design System

> Guia visual e técnico para manter a consistência de UI/UX em todo o projeto  
> **Sistema Computacional de Análise Corpórea**

---

## 1. Identidade Visual

| Item | Valor |
|------|-------|
| **Nome do projeto** | IronFIT |
| **Conceito** | Fitness moderno, dark & bold |
| **Tom visual** | Premium, escuro com acentos vibrantes |
| **Ícone / Logo** | Ondas estilizadas em amarelo (SVG inline) |

### Logo SVG

```html
<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 20C8 14 12 26 16 20C20 14 24 26 28 20" stroke="#E8E032" stroke-width="3" stroke-linecap="round"/>
  <path d="M4 14C8 8 12 20 16 14C20 8 24 20 28 14" stroke="#E8E032" stroke-width="3" stroke-linecap="round"/>
</svg>
```

---

## 2. Paleta de Cores

### 2.1 Cores Primárias (Landing Page / Tema Escuro)

| Token CSS | Hex | Preview | Uso |
|-----------|-----|---------|-----|
| `--amarelo` | `#E8E032` | 🟡 | Cor de destaque, CTAs, bordas, divisores, footer |
| `--amarelo-hover` | `#D4CC2A` | 🟡 | Hover da cor de destaque |
| `--preto` | `#111111` | ⬛ | Fundo principal, textos sobre claro |
| `--preto-claro` | `#1A1A1A` | ⬛ | Variação mais leve do fundo |
| `--branco` | `#FFFFFF` | ⬜ | Textos sobre escuro, backgrounds de seções claras |
| `--cinza` | `#AAAAAA` | 🔘 | Textos secundários, subtítulos |
| `--cinza-escuro` | `#222222` | ⬛ | Backgrounds secundários |

### 2.2 Cores de Formulários (Login / Cadastro)

| Hex | Uso |
|-----|-----|
| `#f4f4f4` | Fundo da página (formulários) |
| `#007BFF` | Botões primários (azul) |
| `#0056B3` | Hover dos botões |
| `#333333` | Títulos e textos |
| `#DDDDDD` | Bordas de inputs |
| `#DC3545` | Mensagens de erro |
| `#28A745` | Mensagens de sucesso |
| `#F8F9FA` | Background de blocos de retorno |

> **⚠️ Nota:** As páginas de login e cadastro ainda usam cores hardcoded.  
> Futuramente, migrar para CSS custom properties para consistência.

---

## 3. Tipografia

### 3.1 Fontes

| Fonte | Tipo | Pesos Usados | Uso |
|-------|------|--------------|-----|
| **Oswald** | Google Font | 400, 500, 600, 700, 800 | Títulos, headings, logo, labels do footer |
| **Inter** | Google Font | 300, 400, 500, 600 | Corpo de texto, botões, links, parágrafos |
| **Arial** | System fallback | — | Fallback e páginas de formulário |

### 3.2 Importação

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

### 3.3 Escala Tipográfica

| Elemento | Fonte | Peso | Tamanho | Extras |
|----------|-------|------|---------|--------|
| **H1 (Hero)** | Oswald | 800 | `clamp(3rem, 8vw, 5.5rem)` | Uppercase, `line-height: 1.05` |
| **H2 (Seções)** | Oswald | 800 | `clamp(2rem, 4vw, 3rem)` | Uppercase, `line-height: 1.1` |
| **H2 (Contato)** | Oswald | 800 | `clamp(2.5rem, 5vw, 4rem)` | Uppercase, `line-height: 1.1` |
| **H3 (Cards)** | Oswald | 700 | `1.2rem` | Uppercase |
| **Body text** | Inter | 400 | `0.95rem` | `line-height: 1.7` |
| **Botão CTA** | Inter | 500 | `0.95rem` | `letter-spacing: 1px` |
| **Links nav** | Inter | 400 | `0.9rem` | `letter-spacing: 0.5px` |
| **Logo text** | Oswald | 700 | `1.1rem` | Uppercase, `letter-spacing: 2px` |
| **Footer label** | Oswald | 700 | `1rem` | Uppercase, `letter-spacing: 2px` |

---

## 4. Espaçamento

### 4.1 Padding de Seções

| Contexto | Desktop | Mobile (≤600px) |
|----------|---------|-----------------|
| Seções gerais | `80px 40px` | `60px 20px` |
| Seção contato | `100px 40px` | `60px 20px` |
| Navbar | `20px 40px` | `16px 20px` |
| Footer | `40px` | `40px` |

### 4.2 Container

```css
max-width: 1200px;
margin: 0 auto;
```

### 4.3 Grid Gaps

| Componente | Gap |
|------------|-----|
| Como funciona (grid) | `60px` (desktop) / `40px` (tablet) |
| Cards entrega | `24px` |

---

## 5. Componentes

### 5.1 Navbar

- **Posição:** `fixed`, `z-index: 1000`
- **Background:** Gradiente transparente → sólido ao scrollar
- **Scroll behavior:** JS muda para `rgba(17, 17, 17, 0.95)` + `backdrop-filter: blur(10px)` após 60px de scroll
- **Links:** Underline amarelo animado no hover (`width: 0 → 100%`)

### 5.2 Botão CTA (Hero)

```css
/* Estado padrão */
padding: 14px 40px;
border: 2px solid var(--branco);
color: var(--branco);
background: transparent;

/* Hover: slide amarelo da esquerda com ::before */
/* Cor do texto muda para --preto */
/* Borda muda para --amarelo */
```

**Animação de hover:** `::before` com `left: -100% → 0` (transição 0.3s)

### 5.3 Cards de Funcionalidades

| Propriedade | Valor |
|-------------|-------|
| Altura | `320px` (desktop) / `250px` (mobile) |
| Border radius | `6px` |
| Hover | `translateY(-6px)` + imagem `scale(1.08)` + `brightness(0.5)` |
| Overlay | Gradiente `transparent → rgba(0,0,0,0.85)` |
| Título | Borda esquerda amarela `3px` + `padding-left: 12px` |

### 5.4 Formulários (Login / Cadastro)

| Propriedade | Valor |
|-------------|-------|
| Container width | `400–420px` |
| Border radius | `10px` (container), `5px` (inputs/botões) |
| Box shadow | `0 0 10px rgba(0,0,0,0.1)` |
| Input padding | `10px` |
| Button padding | `10px 20px` |
| Botão primário | `#007BFF` → hover `#0056B3` |
| Botão disabled | `gray` + `cursor: not-allowed` |

### 5.5 Divisor

```css
.divider {
  width: 100%;
  height: 4px;
  background: var(--amarelo);
}
```

### 5.6 Link "Saiba mais"

```css
border-bottom: 2px solid var(--amarelo);
/* Hover: texto muda para --amarelo-hover */
```

---

## 6. Imagens & Backgrounds

### 6.1 Tratamento de Imagens de Fundo

| Seção | Filter |
|-------|--------|
| Hero | `brightness(0.45) contrast(1.1)` |
| Seção Entrega (bg) | `brightness(0.3)` |
| Seção Contato (bg) | `brightness(0.25)` |

### 6.2 Padrão de Background com Imagem

```html
<div class="section-bg">
  <img src="caminho/imagem.jpg" alt="descrição" />
</div>
```

```css
.section-bg {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 0;
}

.section-bg img {
  width: 100%; height: 100%;
  object-fit: cover;
  filter: brightness(0.XX);
}
```

### 6.3 Tamanhos Recomendados

| Local | Dimensão recomendada |
|-------|---------------------|
| Hero background | 1920×1080px |
| Backgrounds de seção | 1920×800px |
| Imagem "Como funciona" | 600×400px |
| Cards de funcionalidades | 400×320px |

---

## 7. Animações & Transições

### 7.1 Fade-in no Scroll

```css
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Configuração do Observer:**
```javascript
threshold: 0.15
rootMargin: '0px 0px -50px 0px'
```

### 7.2 Transições Padrão

| Elemento | Propriedade | Duração | Easing |
|----------|-------------|---------|--------|
| Links da navbar | `color`, `width` (underline) | `0.3s` | `ease` |
| Botão CTA | `all` (cor, borda), `left` (::before) | `0.3s` | `ease` |
| Cards hover | `transform` | `0.3s` | `ease` |
| Card imagem | `transform`, `filter` | `0.5s` | `ease` |
| Navbar background | `background` | `0.3s` | `ease` |

---

## 8. Breakpoints (Responsivo)

| Breakpoint | Alvo |
|------------|------|
| `≤ 992px` | Tablet — grid 1 coluna, cards 2 cols, navbar sem links |
| `≤ 600px` | Mobile — cards 1 col, padding reduzido, fonte menor |

### Mudanças por Breakpoint

#### Tablet (≤ 992px)
- Grid "Como funciona": `1fr` (empilhado)
- Cards: `1fr 1fr` (2 colunas)
- Navbar links: `display: none`

#### Mobile (≤ 600px)
- Navbar padding: `16px 20px`
- H1 hero: `2.5rem` (fixo)
- Seções padding: `60px 20px`
- Cards: `1fr` (1 coluna)
- Card altura: `250px`

---

## 9. Estrutura de Arquivos CSS

```
front/
├── styles/
│   └── intro.css          ← Landing page (intro.html)
├── src/
│   ├── index.css          ← Reset global + variáveis (React App)
│   └── App.css            ← Componentes da App React
├── login.html             ← CSS inline (a migrar)
├── index.html             ← CSS inline - Cadastro (a migrar)
├── verify.html            ← CSS inline (a migrar)
└── reenviar.html          ← CSS inline (a migrar)
```

> **📋 TODO:** Migrar CSS inline das páginas de formulário (login, cadastro, verify, reenviar) para arquivos em `styles/`.

---

## 10. Convenções de Nomenclatura

### Classes CSS

- **BEM-like simplificado:** `.componente-elemento` (sem modificadores duplos)
- **Exemplos:**
  - `.navbar-logo`, `.navbar-logo-text`, `.navbar-links`
  - `.hero-bg`, `.hero-content`, `.hero-cta`
  - `.card-entrega`, `.card-entrega-overlay`
  - `.section-como-funciona`, `.section-entrega`, `.section-contato`
  - `.footer-label`, `.footer-email`

### IDs (JavaScript)

| ID | Uso |
|----|-----|
| `navbar` | Controle de scroll da navbar |
| `hero` | Seção hero |
| `como-funciona` | Âncora de navegação |
| `entrega` | Âncora de navegação |
| `contato` | Âncora de navegação |
| `btn-comecar` | Botão CTA principal |
| `formLogin` | Formulário de login |
| `formCadastro` | Formulário de cadastro |

---

## 11. Z-Index Scale

| Camada | Z-Index | Elemento |
|--------|---------|----------|
| Navbar | `1000` | `.navbar` |
| Conteúdo sobre bg | `2` | `.hero-content`, `.section-*-content` |
| Background images | `0` | `.hero-bg`, `.section-*-bg` |
| CTA ::before | `-1` | Animação de hover |

---

## 12. Roadmap de Design

- [ ] Migrar CSS inline (login, cadastro, verify, reenviar) para `styles/`
- [ ] Criar `styles/global.css` com reset e variáveis compartilhadas
- [ ] Unificar paleta de cores (formulários usam cores diferentes da landing)
- [ ] Adicionar dark mode toggle nos formulários
- [ ] Criar componente de navbar reutilizável
- [ ] Adicionar menu hamburger para mobile
- [ ] Implementar sistema de grid/spacing tokens
- [ ] Adicionar favicon personalizado IronFIT
