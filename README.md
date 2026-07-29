# Matriarch Coffee — Shopify Theme

Shopify 2.0 theme built on the Horizon base, replacing the store's existing theme
and CSS. Mobile-first, scaling up to tablet and desktop, targeting a Google
Lighthouse performance score above 90.

## Stack

- Shopify 2.0 (Online Store 2.0) — sections, blocks, JSON templates
- Base theme: Horizon
- Shopify CLI 3.x

## Environments

Configured in `shopify.theme.toml`:

- **production** — live theme
- **staging** — client/team preview theme
- **development** — local dev, spins up a new unpublished theme per session

Fill in the real theme IDs in `shopify.theme.toml` once themes exist in the
Shopify admin.

## Setup

```bash
npm install -g @shopify/cli @shopify/theme
shopify auth login
shopify theme dev --store matriarch-coffee.myshopify.com
```

## Branching

- `main` — production, matches the live theme
- `develop` — staging theme, integration branch for features
- `feature/*` — one branch per section/template/feature (e.g. `feature/product-page`, `feature/cart-drawer`)

Open a PR from `feature/*` into `develop`. Merge `develop` into `main` for releases.

## Folder structure

```
assets/        compiled CSS/JS, images, icons
blocks/        reusable content blocks (2.0)
config/        settings_schema.json, settings_data.json
layout/        theme.liquid, checkout wrappers
locales/       translation files
sections/      section files with {% schema %}
snippets/      reusable liquid partials
templates/     JSON templates per page type
```

## Conventions

- Sections and blocks use Shopify's `{% schema %}` JSON for merchant-editable
  settings — no hardcoded content in custom sections.
- Mobile-first CSS: base styles target mobile, use `min-width` media queries
  to scale up to tablet/desktop.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `style:`, `refactor:`, `chore:`).
- Performance budget: Lighthouse score > 90 on mobile and desktop before merging
  to `main`.

## Design reference

Layout and site-wide CSS follow the provided Figma designs and fully replace
the existing theme/CSS files — no legacy theme styles carried over.
