# Shreyas | Portfolio

A sleek, dark-themed personal portfolio website inspired by the design language of [Shift5.io](https://shift5.io/) — built to showcase projects, skills, and experience.

## ✨ Features

- **Bold, dark aesthetic** — deep blacks, dark grays, electric-blue accent (`#00d4ff`)
- **Sticky navbar** with smooth-scroll navigation and mobile hamburger menu
- **Hero section** — full-viewport height with animated grid background, typing effect, and entrance animations
- **About section** — split layout with animated scroll-triggered counters
- **Skills section** — category cards (Frontend, Backend, Databases, DevOps & Tools) with hover effects
- **Projects section** — 6 portfolio cards with filter (All / Frontend / Backend / Full Stack), card-lift hover effects, and gradient thumbnails
- **Contact section** — styled form with live client-side validation + social links
- **Footer** — social icons, dynamic copyright year, and back-to-top button
- **Fully responsive** — mobile, tablet, desktop breakpoints
- **No frameworks** — pure HTML5 + CSS3 + Vanilla JS, GitHub Pages–ready

## 📁 Project Structure

```
port/
├── index.html        # Main page — all sections
├── css/
│   └── style.css     # All custom styles (CSS variables, grid, flexbox, animations)
├── js/
│   └── main.js       # All interactivity (scroll animations, typing, filters, form)
└── README.md
```

## 🚀 Quick Start

### Option 1 — Open locally (no server needed)

```bash
# Clone the repository
git clone https://github.com/Shreyas099/port.git
cd port

# Open in browser
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### Option 2 — GitHub Pages

1. Push this repo to GitHub (already done ✅)
2. Go to **Settings → Pages**
3. Set **Source** to `Deploy from a branch` → `main` → `/ (root)`
4. Click **Save** — your site will be live at `https://Shreyas099.github.io/port/`

## 🎨 Design Tokens

| Variable | Value | Description |
|---|---|---|
| `--bg-primary` | `#0a0a0a` | Page background |
| `--bg-secondary` | `#111111` | Alternate section background |
| `--bg-card` | `#1a1a1a` | Card / form background |
| `--text-primary` | `#ffffff` | Main text |
| `--text-secondary` | `#a0a0a0` | Muted / secondary text |
| `--accent` | `#00d4ff` | Electric blue accent |
| `--accent-hover` | `#00b8d4` | Darker accent on hover |
| `--border` | `#2a2a2a` | Subtle borders |

## 🛠 Tech Stack

- **HTML5** — Semantic markup, inline SVG icons, `aria-*` accessibility attributes
- **CSS3** — CSS custom properties, Grid, Flexbox, `@keyframe` animations, `clamp()` for fluid typography, `backdrop-filter` for glassmorphism
- **Vanilla JavaScript** — Intersection Observer API (scroll animations + counters), typing effect, project filter, mobile menu, form validation

## ✏️ Customisation

1. **Personal info** — Replace placeholder text in `index.html` (name, bio, email, social links)
2. **Projects** — Update the `<article class="project-card">` blocks with your real projects, GitHub URLs, and live demo links
3. **Colors** — Edit the CSS variables in `:root` inside `css/style.css`
4. **Typing phrases** — Edit the `phrases` array in `js/main.js`

## 📄 License

MIT — feel free to use this as a starting point for your own portfolio.
