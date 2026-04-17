# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start Vite dev server (hot reload)
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## Architecture

This is a React single-page app that serves as the front-end prototype for The Happy Hunting Grounds Shopify store. It is **not yet a Shopify Liquid theme** — it is a Vite + React prototype intended to be referenced when building the real Shopify theme.

### Entry points

- `index.html` — loads Tailwind CSS via CDN and mounts the React app
- `src/main.jsx` — calls `createRoot` on `#root` and renders `THHGWebsite`
- `src/thhg_homepage.jsx` — the entire application lives in one file

### State and routing

There is no router. Navigation is managed with a single `useState('home')` in the root `THHGWebsite` component. `navigate` is a `useCallback`-wrapped `setCurrentPage` passed down to every page component. Page changes trigger a `useEffect` that calls `window.scrollTo({ top: 0 })`.

```
THHGWebsite              ← owns currentPage state + navigate callback
  └── SiteShell          ← sticky header (hamburger menu), footer, <main>
        └── PAGES[currentPage](navigate)   ← renders the active page
```

The `PAGES` map is the routing table:
```js
const PAGES = {
  home, 'our-story', shop, apparel, product, 'lives-changed', contact
};
```

### Design system

All styling is Tailwind utility classes (CDN). Brand-specific CSS (animations, font imports, mobile nav transition) lives in the `FontStyles` component which renders a `<style>` tag. CSS class prefixes:
- `.thhg-rye` / `.thhg-oswald` / `.thhg-baskerville` — font families
- `.thhg-shine` — CTA button shine animation
- `.thhg-card` — hover lift effect
- `.thhg-logo-pop`, `.thhg-hero-card`, `.thhg-marquee`, `.thhg-star-pop` — decorative animations
- `.thhg-mobile-nav` — CSS grid row-height transition for the hamburger dropdown

Brand color reference (used as Tailwind arbitrary values throughout):
- Navy: `#0F1A2E` (dark) / `#1B2A4A` (mid)
- Red: `#B5282A`
- Gold: `#C8882A` / `#E8A83A` (light)
- Cream: `#F5EDD8` / `#FDFAF4` (warm white)
- Tan: `#D4B483`

### Shared components

| Component | Purpose |
|-----------|---------|
| `PageHero` | Full-width dark hero with animated badge card on the right |
| `MarqueeBand` | Scrolling gold ticker strip |
| `SectionHeader` | Eyebrow + h2 + optional body copy |
| `CardGrid` | Responsive 3-col card grid; accepts `dark` prop for inverted palette |
| `StatCard` | Single stat value + label block |

### Asset

`src/thhg_happy_hunting_grounds_logo.jpeg` — the only image asset. Used as the brand logo in the header, footer, hero card, and as a decorative watermark.

### Next steps toward Shopify

When converting this prototype to a Shopify Dawn-based theme:
- Sections → `sections/*.liquid` files with `{% schema %}` blocks
- Product data → Shopify `product` object (replace hardcoded copy)
- Email signup → Shopify Customer API or a Klaviyo integration
- Add to cart → Shopify AJAX Cart API
- The `navigate` pattern maps roughly to Shopify's URL routing
