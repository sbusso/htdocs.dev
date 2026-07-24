# Repository Guidelines

## Project Structure & Module Organization

This repository is an Astro 4 blog with React islands and Tailwind CSS.
Application code lives in `src/`: route files are in `src/pages/`, reusable UI
in `src/components/`, page shells in `src/layouts/`, helpers in `src/utils/`,
and global styles in `src/styles/`. Blog posts are Markdown files under
`src/content/blog/`; their frontmatter is validated by
`src/content/config.ts`. Put imported images in `src/assets/` and files that
must retain their names and URLs in `public/`. Treat `src/backup/` as archived
content, not active application code. Production output is generated in
`dist/`.

## Build, Test, and Development Commands

Use Bun because `bun.lock` is committed:

- `bun install` installs dependencies.
- `bun run dev` starts Astro at `http://localhost:4321`.
- `bun run sync` regenerates Astro and content collection types.
- `bunx astro check` checks Astro, TypeScript, and content schemas.
- `bun run lint` runs ESLint across the repository.
- `bun run format:check` verifies Prettier formatting.
- `bun run build` creates and optimizes the production site in `dist/`.
- `bun run preview` serves the built site for final inspection.

## Coding Style & Naming Conventions

Prettier is authoritative: use two-space indentation, double quotes,
semicolons, an 80-column target, and LF endings. Run `bun run format` before
submitting broad formatting changes. ESLint applies its recommended rules plus
Astro-specific rules. Name Astro and React components in PascalCase
(`PostNavigation.astro`, `Search.tsx`), utilities in camelCase
(`getSortedPosts.ts`), and route files according to Astro conventions such as
`[slug]/index.astro`. Prefer configured aliases such as `@components/*` and
`@utils/*` over deep relative imports.

## Testing Guidelines

There is currently no unit-test framework or coverage threshold. Every change
should pass `bunx astro check`, `bun run lint`, `bun run format:check`, and
`bun run build`. For UI or content changes, inspect the affected route with
`bun run dev`; verify mobile and desktop layouts, light and dark themes, links,
and generated metadata. New posts must satisfy the frontmatter schema, including
`title`, `description`, `created`, and `tags`.

## Commit & Pull Request Guidelines

History mixes publisher merges with Conventional Commit subjects. For manual
changes, use concise imperative messages such as
`fix: correct post navigation` or `feat: add topic filtering`. Keep commits
focused. Pull requests should explain the change and validation performed,
link related issues, and include before/after screenshots for visible changes.
Call out content migrations, configuration changes, or generated-file updates.
