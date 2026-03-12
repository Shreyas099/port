# Shreyas Portfolio

A futuristic, multi-page developer portfolio website built with pure HTML5, CSS3, and Vanilla JavaScript — no frameworks, no build tools.

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, nav cards, tech ticker |
| About | `about.html` | Bio, timeline, flip cards, resume |
| Skills | `skills.html` | Flip card skill display with progress rings |
| Projects | `projects.html` | Filterable project grid with modal |
| Contact | `contact.html` | Form, FAQ, map placeholder |

## File Structure

```
port/
├── index.html
├── about.html
├── skills.html
├── projects.html
├── contact.html
├── css/
│   ├── style.css          # Global styles, variables, navbar, footer
│   └── pages/
│       ├── home.css
│       ├── about.css
│       ├── skills.css
│       ├── projects.css
│       └── contact.css
└── js/
    ├── main.js            # Shared: cursor, navbar, scroll reveal, transitions
    └── pages/
        ├── home.js        # Typing effect, animated counters
        ├── about.js       # Timeline, flip cards, skill bars
        ├── skills.js      # Progress rings, flip cards, filter
        ├── projects.js    # Filter, staggered animations, modal
        └── contact.js     # Floating labels, validation, FAQ accordion
```

## Features

- **Custom cursor** with trailing ring and hover state
- **CSS star field** using box-shadow (no canvas)
- **Glitch text** effect on hero title
- **Glassmorphism** navbar on scroll
- **Typing effect** cycling through roles
- **Animated counters** triggered on scroll
- **Tech ticker marquee** (CSS-only infinite scroll)
- **Flip cards** for skills and fun facts
- **Progress rings** using `conic-gradient`
- **Rotating gradient border** using CSS `@property --angle`
- **Vertical alternating timeline** on About page
- **Project filter** with smooth transitions
- **Project modal** with full details
- **Floating label form** with live validation
- **FAQ accordion**
- **Page transition** fade overlay
- **Scroll reveal** via IntersectionObserver
- **Fully responsive** — mobile, tablet, desktop

## Color Palette

| Variable | Value |
|----------|-------|
| `--bg-primary` | `#050505` |
| `--accent` | `#00d4ff` |
| `--accent-secondary` | `#7c3aed` |
| `--accent-tertiary` | `#00ff88` |
| `--neon-pink` | `#ff0080` |

## Deployment

This site is static and GitHub Pages compatible. Push to a `gh-pages` branch or enable Pages from the repository settings.

## License

MIT
