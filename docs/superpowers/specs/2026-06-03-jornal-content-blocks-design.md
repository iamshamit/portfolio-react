# Jornal Content Block System — Design Spec
**Date:** 2026-06-03  
**Status:** Approved  
**Scope:** Extend the journal article renderer with ~45 rich block types, Prism.js syntax highlighting, a sticky TOC sidebar, and a JOURNAL_GUIDE.md reference doc.

---

## 1. Problem

The current `Article` component in `Sections.jsx` renders journal post bodies with 5 block types: `h`, `quote`, `code`, `list`, `p`. The journal data already uses a JSON block array format (`body: [{ h: "..." }, { p: "..." }, ...]`) that is designed for extensibility. To write rich tutorials, essays, and project showcases, the renderer needs to support ~45 block types covering callouts, tables, tabs, timelines, media embeds, project cards, metadata, and more.

---

## 2. Approach

**Option B — Dedicated `JournalBlocks.jsx`** (chosen over inline extension and a full registry pattern).

All block components live in a new `src/components/JournalBlocks.jsx`. The `Article` component in `Sections.jsx` imports a single `<BlockRenderer>` and delegates every block to it. This keeps `Sections.jsx` lean, co-locates block logic with its styles, and avoids over-engineering a registry for a portfolio-scale project.

---

## 3. Files Changed

| File | Change |
|---|---|
| `src/components/JournalBlocks.jsx` | New — all block components + `BlockRenderer` |
| `src/components/JournalBlocks.css` | New — styles for all new block types |
| `src/components/Sections.jsx` | Modified — `Article` uses `<BlockRenderer>`, two-column TOC layout |
| `src/index.css` | Modified — minor article layout tweaks |
| `package.json` | Modified — add `prismjs` |
| `JOURNAL_GUIDE.md` | New — block reference cheat sheet at repo root |

---

## 4. Architecture

### Data flow
1. `Article` receives a `post` object from `PORTFOLIO.journal[index]`
2. `Article` scans `post.body` for a `{ toc: true }` block to determine layout mode
3. If TOC present → two-column layout (content left, sticky `<Toc>` right)
4. Every block renders via `<BlockRenderer block={b} index={i} post={post} />`
5. `BlockRenderer` matches the block's key and delegates to the matching sub-component
6. Prism.js is imported once in `JournalBlocks.jsx`; `CodeBlock` calls `Prism.highlight()` inside a `useEffect`

### TOC generation
- `<Toc>` receives the full `post.body` array
- Extracts all `{ h }`, `{ h2 }`, `{ h3 }` blocks in order
- Renders as a nested `<nav>` with anchor links
- Each `<Heading>` generates a slug ID (`id={slug(text)}`) for scroll targets
- On desktop (>768px): sticky sidebar, 240px wide
- On mobile (≤768px): `<details>` disclosure at top of article, collapsed by default

### Prism.js integration
- Installed as `prismjs` (plain, no React wrapper needed)
- Custom theme defined in `JournalBlocks.css` overriding Prism's default token colors to match portfolio palette
- Language auto-detected from `filename` extension (`.js` → javascript, `.ts` → typescript, `.sh` → bash, etc.) or falls back to plain text

---

## 5. Block Inventory

### Typography
| Block shape | Component | Behaviour |
|---|---|---|
| `{ h: "text" }` | `<Heading level={1}>` | Large h2, gets slug ID for TOC |
| `{ h2: "text" }` | `<Heading level={2}>` | Medium h3 |
| `{ h3: "text" }` | `<Heading level={3}>` | Small h4 |
| `{ p: "text" }` | `<Paragraph>` | Body text, `**bold**`/`*italic*` via `fmt()` |
| `{ lead: "text" }` | `<Lead>` | Large italic intro paragraph |
| `{ quote: "text", cite: "source" }` | `<Quote>` | Existing, gradient border, unchanged |
| `{ divider: true }` | `<Divider>` | Styled `<hr>` |
| `{ spacer: "sm"|"md"|"lg" }` | `<Spacer>` | 24/48/80px vertical gap |

### Lists & Steps
| Block shape | Component | Behaviour |
|---|---|---|
| `{ list: ["..."] }` | `<BulletList>` | Existing amber-dash bullets |
| `{ ordered: ["..."] }` | `<OrderedList>` | Numbered list, matching style |
| `{ steps: ["..."] }` | `<Steps>` | Vertical stepper — numbered circles + connecting line |
| `{ prerequisites: ["..."] }` | `<Prerequisites>` | Checklist with tick icons, "Prerequisites" header |
| `{ outcome: ["..."] }` | `<Outcome>` | "What you'll build" — tick list, distinct header |

### Code
| Block shape | Component | Behaviour |
|---|---|---|
| `{ code: "...", filename?, collapsible?, collapsed?, copyButton?, lineNumbers? }` | `<CodeBlock>` | Prism highlight, optional header bar, collapse toggle, copy button, line numbers |
| `{ tree: "..." }` | `<FileTree>` | Monospace, no highlight, tree-specific styling |
| `{ file: "path/file.js" }` | `<FileLabel>` | Filename pill/badge |
| `{ command: "npm run dev" }` | `<Command>` | Dark terminal style, `$` prefix, copy always on |

### Media & Embeds
| Block shape | Component | Behaviour |
|---|---|---|
| `{ image: "/path", caption?: "..." }` | `<ImageBlock>` | Full-width image, caption below |
| `{ video: "/path", caption?: "..." }` | `<VideoBlock>` | `<video controls>` element |
| `{ embed: { type: "youtube"|"loom", url: "..." } }` | `<Embed>` | Responsive 16:9 iframe |
| `{ architecture: "/path" }` | `<ArchDiagram>` | Full-width image, distinct label/frame |

### Callouts & Alerts
| Block shape | Component | Behaviour |
|---|---|---|
| `{ note: "text" }` | `<Callout type="note">` | Shorthand → Alert info |
| `{ warning: "text" }` | `<Callout type="warning">` | Shorthand → Alert warning |
| `{ success: "text" }` | `<Callout type="success">` | Shorthand → Alert success |
| `{ tip: "text" }` | `<Callout type="tip">` | Shorthand → Alert tip |
| `{ callout: { title, content } }` | `<Callout type="callout">` | Titled highlight box |
| `{ alert: { type, title?, content } }` | `<Alert>` | Canonical — `info`/`warning`/`error`/`success` |

### Labels, Links & Metadata
| Block shape | Component | Behaviour |
|---|---|---|
| `{ badge: "text" }` | `<Badge>` | Single pill tag |
| `{ tags: ["..."] }` | `<Tags>` | Row of `<Badge>` items |
| `{ tech: ["..."] }` | `<TechStack>` | Styled tech pills with subtle color |
| `{ link: { text, href } }` | `<ArticleLink>` | `↗` styled external link |
| `{ author: "name" }` | `<AuthorBlock>` | Author metadata chip |
| `{ readingTime: "15 min" }` | `<ReadingTime>` | Metadata chip |
| `{ updated: "May 2026" }` | `<Updated>` | "Last updated" metadata chip |

### Rich Blocks
| Block shape | Component | Behaviour |
|---|---|---|
| `{ table: { headers, rows } }` | `<Table>` | Responsive, horizontally scrollable on mobile |
| `{ accordion: { title, content } }` | `<Accordion>` | Toggle-expand section |
| `{ tabs: [{ label, content }] }` | `<Tabs>` | Tabbed switcher, active tab uses gradient accent |
| `{ compare: { left, right } }` | `<Compare>` | Two-column before/after; stacks on mobile |
| `{ metric: { label, value } }` | `<Metric>` | Label + large stat value |
| `{ timeline: [{ title, date }] }` | `<Timeline>` | Vertical timeline with title + date |
| `{ github: { repo: "user/repo" } }` | `<GitHubCard>` | Static card — repo name + link, no API |
| `{ demo: "https://..." }` | `<DemoButton>` | CTA button to live URL |
| `{ project: { title, description, stack, github?, demo? } }` | `<ProjectCard>` | Rich card matching `.jrow` aesthetic |

### Navigation
| Block shape | Component | Behaviour |
|---|---|---|
| `{ toc: true }` | `<Toc>` | Sticky sidebar (desktop) / `<details>` collapse (mobile) |

---

## 6. Visual Language

All components follow the established dark palette from `index.css`:

| Token | Value | Usage |
|---|---|---|
| Background | `#050505` / `#000` | Code blocks, cards |
| Border faint | `var(--faint)` | Card borders, dividers |
| Muted text | `var(--muted)` | Captions, metadata |
| Amber accent | `#ffac2e` | Warning alerts, step numbers, command `$`, active tab |
| Green accent | `#a0e0ab` | Success, code strings |
| Blue accent | `#7eb8f7` | Info alerts, numbers |
| Red accent | `#f87171` | Error alerts |
| Gradient border | `var(--g-ocean/teal/aurora/ember)` | Quote borders, TOC active indicator — adapts to `data-grad` |

### Prism token mapping
| Token | Color |
|---|---|
| Keyword | `#ffac2e` (amber) |
| String | `#a0e0ab` (green) |
| Comment | `rgba(255,255,255,.35)` |
| Number / boolean | `#7eb8f7` (blue) |
| Function | `#c4b5fd` (purple) |
| Operator / punctuation | `rgba(255,255,255,.6)` |

### Code block anatomy
```
┌──────────────────────────────────────────────┐
│ 📄 server.js                    [Copy] [▼]   │  ← header (filename + buttons)
├──────────────────────────────────────────────┤
│  1  const express = require('express')       │  ← line numbers + highlighted code
│  2  const app = express()                    │
└──────────────────────────────────────────────┘
```
Collapsed state: header visible, code body hidden, button shows `[▶ Show]`.

### Article layout (TOC present, desktop)
```
┌─────────────────────────────┬──────────────────┐
│  Article content (max 680px)│  TOC (240px)     │
│                             │  position:sticky │
│                             │  top: 100px      │
└─────────────────────────────┴──────────────────┘
```

---

## 7. Error Handling

- **Missing required fields**: `BlockRenderer` renders nothing for unknown/malformed blocks (silent skip, no crash)
- **Image/video load fail**: `<img>` uses `onError` to show a placeholder frame
- **Embed (YouTube/Loom)**: Wrapped in a fixed-ratio container; if iframe fails, shows a fallback link
- **Prism language not found**: Falls back to plain text styling

---

## 8. Additional Deliverable

`JOURNAL_GUIDE.md` at repo root — a human-readable cheat sheet covering:
- Every block's JSON shape with a copy-paste example
- A rendered description of what it looks like
- Grouped by category
- A full example journal post using all major block types

This file is the primary reference for writing new journal entries without memorizing the API.
