# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"路上小游戏" (Road Games) — a mobile-first web app for parent-child interactive mini-games designed for play during walks. No build tools or framework; it's vanilla JS/CSS/HTML loaded directly in the browser.

## Development

No build step. To develop:
- Serve the project with any static server, e.g. `python3 -m http.server 8080` or `npx serve .`
- Open `index.html` directly in a browser (some browsers may block localStorage on `file://`)
- All JS uses global `window` exports; no module system or bundler

## Architecture

The app follows a simple MVC-ish pattern with hash-based routing:

```
index.html          → Shell layout (header, #main-content, bottom nav)
├── js/
│   ├── store.js    → State management (localStorage persistence, badges, game stats, streaks)
│   ├── games.js    → Game registry + metadata (GAME_METADATA, daily game selection via date-seeded hash)
│   ├── game-engine.js → Step-based game runner (renders intro → observation → input → challenge → complete steps)
│   └── app.js      → Router + page renderers (home, badges, about, game launch)
├── games/
│   ├── shop-game.js      → "猜猜这家店开了几年"
│   ├── plant-game.js     → "认认路边的植物"
│   ├── sound-game.js     → "声音小游戏"
│   ├── color-game.js     → "色彩寻宝"
│   └── people-game.js    → "看看身边的人"
└── components/
    └── badge-card.js → Badge card HTML generator
```

### Key Patterns

- **Global exports**: Each module attaches itself to `window` (e.g., `window.Store`, `window.Games`, `window.GameEngine`)
- **Script tag loading**: Dependencies loaded via `<script>` tags in `index.html` — order matters (`store.js` → `games.js` → `game-engine.js` → individual games → `app.js`)
- **Hash routing**: Routes defined in `app.js` as a simple `{ path: handler }` map with pattern matching for `/game/:id`
- **Step-based gameplay**: Each game is an array of `steps` with types: `intro`, `observation`, `timer`, `input`, `challenge`, `complete`
- **Badge system**: Badges unlock after completing a game N times (threshold per game, stored in localStorage)
- **CSS custom properties**: Design tokens defined in `:root` for colors, shadows, and radii

### CSS Design Tokens

| Token | Value |
|-------|-------|
| `--color-primary` | `#FF8B66` |
| `--color-secondary` | `#7AC5A7` |
| `--color-accent` | `#FFD97D` |
| `--color-text` | `#2C3E50` |
| `--color-bg` | `#FFF9F5` |
