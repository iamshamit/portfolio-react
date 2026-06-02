# Jornal Content Block System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a rich ~45-block content system for the portfolio journal — Prism.js syntax highlighting, sticky TOC sidebar, and a `JOURNAL_GUIDE.md` reference cheat sheet.

**Architecture:** All block components live in a new `src/components/JournalBlocks.jsx`; `Article` in `Sections.jsx` delegates body rendering to `<BlockRenderer>` and switches to a two-column grid when the post contains `{ toc: true }`. Prism.js handles syntax highlighting; language is auto-detected from the `filename` extension.

**Tech Stack:** React 18, prismjs, CSS custom properties (no Tailwind), Clipboard API

> **Note on testing:** This project has no test framework (vitest/jest). Each task ends with visual verification via `npm run dev` at `http://localhost:5173` instead of automated tests.

---

## File map

| File | Action | Responsibility |
|---|---|---|
| `src/components/JournalBlocks.jsx` | Create | All ~45 block components + `BlockRenderer` + `Toc` + `TocMobile` |
| `src/components/JournalBlocks.css` | Create | Styles for all new block types + Prism token overrides |
| `src/components/Sections.jsx` | Modify | Remove inline `fmt()` + inline renderer; import `BlockRenderer`, `Toc`, `TocMobile`; two-column layout when TOC present |
| `src/index.css` | Modify | Two-column article layout CSS |
| `package.json` | Modify | Add `prismjs` |
| `JOURNAL_GUIDE.md` | Create | Human-readable block reference cheat sheet |
| `src/data/config.js` | Modify | Add a demo journal entry exercising all major block types |

---

## Task 1: Install Prism.js

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install prismjs**

```bash
cd E:/portfolio-react
npm install prismjs
```

Expected output ends with: `added 1 package` (or similar). Prism is a plain JS package — no peer deps.

- [ ] **Step 2: Verify install**

```bash
ls node_modules/prismjs
```

Expected: directory exists and contains `prism.js`, `components/`, `themes/`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add prismjs for syntax highlighting"
```

---

## Task 2: Create JournalBlocks.jsx

**Files:**
- Create: `src/components/JournalBlocks.jsx`

This task writes the entire file in logical groups. Each step appends the next group; the final step has the complete file ready.

- [ ] **Step 1: Create the file with imports and utility functions**

Create `src/components/JournalBlocks.jsx`:

```jsx
import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markup';
import './JournalBlocks.css';

function fmt(text) {
  if (!text) return null;
  const out = []; let key = 0;
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) out.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    else out.push(<em key={key++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function slug(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function detectLang(filename) {
  if (!filename) return 'javascript';
  const ext = filename.split('.').pop().toLowerCase();
  const map = {
    js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx',
    sh: 'bash', bash: 'bash', json: 'json', css: 'css',
    html: 'markup', htm: 'markup', py: 'python', go: 'go', sql: 'sql',
  };
  return map[ext] || 'javascript';
}
```

- [ ] **Step 2: Add Typography group**

Append to `src/components/JournalBlocks.jsx`:

```jsx
// ── Typography ────────────────────────────────────────────────────────────────

function Heading({ level, text }) {
  const id = slug(text);
  const tags  = ['h2', 'h3', 'h4'];
  const classes = ['a-h', 'a-h2', 'a-h3'];
  const Tag = tags[level - 1];
  const cls = classes[level - 1];
  return <Tag id={id} className={cls}>{text}</Tag>;
}

function Paragraph({ text }) {
  return <p className="a-p">{fmt(text)}</p>;
}

function Lead({ text }) {
  return <p className="a-lead">{text}</p>;
}

function Quote({ text, cite }) {
  return (
    <blockquote className="a-quote">
      <span>{text}</span>
      {cite && <cite>{cite}</cite>}
    </blockquote>
  );
}

function Divider() {
  return <hr className="a-divider" />;
}

function Spacer({ size = 'md' }) {
  return <div className={`a-spacer a-spacer-${size}`} />;
}
```

- [ ] **Step 3: Add Lists & Steps group**

Append to `src/components/JournalBlocks.jsx`:

```jsx
// ── Lists & Steps ─────────────────────────────────────────────────────────────

function BulletList({ items }) {
  return (
    <ul className="a-list">
      {items.map((li, i) => <li key={i}>{fmt(li)}</li>)}
    </ul>
  );
}

function OrderedList({ items }) {
  return (
    <ol className="a-olist">
      {items.map((li, i) => <li key={i}>{fmt(li)}</li>)}
    </ol>
  );
}

function Steps({ items }) {
  return (
    <div className="a-steps">
      {items.map((step, i) => (
        <div className="a-step" key={i}>
          <div className="a-step-num">{i + 1}</div>
          <div className="a-step-text">{fmt(step)}</div>
        </div>
      ))}
    </div>
  );
}

function Prerequisites({ items }) {
  return (
    <div className="a-checklist a-prereq">
      <div className="a-checklist-head">Prerequisites</div>
      <ul>
        {items.map((item, i) => (
          <li key={i}><span className="a-check">✓</span>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Outcome({ items }) {
  return (
    <div className="a-checklist a-outcome">
      <div className="a-checklist-head">What you'll build</div>
      <ul>
        {items.map((item, i) => (
          <li key={i}><span className="a-check">✓</span>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Add Code group**

Append to `src/components/JournalBlocks.jsx`:

```jsx
// ── Code ──────────────────────────────────────────────────────────────────────

function CodeBlock({ code, filename, collapsible, collapsed: initCollapsed, copyButton, lineNumbers }) {
  const [open, setOpen] = React.useState(initCollapsed !== true);
  const [copied, setCopied] = React.useState(false);
  const lang = detectLang(filename);
  const hasHeader = filename || collapsible || copyButton || initCollapsed !== undefined;

  const highlighted = React.useMemo(() => {
    try {
      const grammar = Prism.languages[lang];
      return grammar ? Prism.highlight(code, grammar, lang) : code;
    } catch { return code; }
  }, [code, lang]);

  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="a-code-wrap">
      {hasHeader && (
        <div className="a-code-header">
          {filename && <span className="a-code-filename">{filename}</span>}
          <div className="a-code-actions">
            {copyButton && (
              <button className="a-code-btn" onClick={copy}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            )}
            {(collapsible || initCollapsed !== undefined) && (
              <button className="a-code-btn" onClick={() => setOpen(o => !o)}>
                {open ? '▼ Hide' : '▶ Show'}
              </button>
            )}
          </div>
        </div>
      )}
      {open && (
        <pre className={`a-code${lineNumbers ? ' a-ln' : ''}`}>
          {lineNumbers && (
            <span className="a-ln-nums" aria-hidden>
              {code.split('\n').map((_, i) => <span key={i}>{i + 1}</span>)}
            </span>
          )}
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      )}
    </div>
  );
}

function FileTree({ tree }) {
  return (
    <div className="a-filetree">
      <pre>{tree}</pre>
    </div>
  );
}

function FileLabel({ file }) {
  return <span className="a-filelabel">{file}</span>;
}

function Command({ command }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="a-command">
      <div className="a-command-inner">
        <span className="a-command-prompt">$</span>
        <span className="a-command-text">{command}</span>
      </div>
      <button className="a-command-copy" onClick={copy}>{copied ? '✓' : 'Copy'}</button>
    </div>
  );
}
```

- [ ] **Step 5: Add Media & Embeds group**

Append to `src/components/JournalBlocks.jsx`:

```jsx
// ── Media & Embeds ────────────────────────────────────────────────────────────

function ImageBlock({ image, caption }) {
  return (
    <figure className="a-img-wrap">
      <img src={image} alt={caption || ''} onError={e => { e.target.style.opacity = '0.3'; }} />
      {caption && <figcaption className="a-caption">{caption}</figcaption>}
    </figure>
  );
}

function VideoBlock({ video, caption }) {
  return (
    <figure className="a-video-wrap">
      <video src={video} controls />
      {caption && <figcaption className="a-caption">{caption}</figcaption>}
    </figure>
  );
}

function Embed({ embed }) {
  const { type, url } = embed;
  function getEmbedUrl() {
    if (type === 'youtube') {
      const m = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
      return m ? `https://www.youtube.com/embed/${m[1]}` : url;
    }
    if (type === 'loom') return url.replace('loom.com/share/', 'loom.com/embed/');
    return url;
  }
  return (
    <div className="a-embed">
      <iframe
        src={getEmbedUrl()}
        title={type}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function ArchDiagram({ architecture }) {
  return (
    <div className="a-arch">
      <div className="a-arch-label">Architecture</div>
      <img src={architecture} alt="System architecture diagram" />
    </div>
  );
}
```

- [ ] **Step 6: Add Callouts & Alerts group**

Append to `src/components/JournalBlocks.jsx`:

```jsx
// ── Callouts & Alerts ─────────────────────────────────────────────────────────

const ALERT_ICONS = {
  info: 'ℹ', warning: '⚠', error: '✕', success: '✓', tip: '💡', callout: '◆',
};

function Alert({ type = 'info', title, content }) {
  return (
    <div className="a-alert" data-type={type}>
      <span className="a-alert-icon">{ALERT_ICONS[type] || 'ℹ'}</span>
      <div className="a-alert-body">
        {title && <div className="a-alert-title">{title}</div>}
        <div className="a-alert-text">{content}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Add Labels, Links & Metadata group**

Append to `src/components/JournalBlocks.jsx`:

```jsx
// ── Labels, Links & Metadata ──────────────────────────────────────────────────

function Badge({ badge }) {
  return <span className="a-badge">{badge}</span>;
}

function Tags({ tags }) {
  return (
    <div className="a-tags">
      {tags.map((t, i) => <span key={i} className="a-badge">{t}</span>)}
    </div>
  );
}

function TechStack({ tech }) {
  return (
    <div className="a-techstack">
      {tech.map((t, i) => <span key={i} className="a-tech-pill">{t}</span>)}
    </div>
  );
}

function ArticleLink({ link }) {
  return (
    <a href={link.href} target="_blank" rel="noreferrer" className="a-extlink">
      {link.text}<span className="a-extlink-arrow">↗</span>
    </a>
  );
}

function AuthorBlock({ author }) {
  return (
    <div className="a-author">
      <div className="a-author-avatar">{author.charAt(0).toUpperCase()}</div>
      <div>
        <div className="a-author-name">{author}</div>
        <div className="a-author-label">Author</div>
      </div>
    </div>
  );
}

function ReadingTime({ readingTime }) {
  return <div className="a-meta-chip">⏱ {readingTime} read</div>;
}

function Updated({ updated }) {
  return <div className="a-meta-chip">Updated {updated}</div>;
}
```

- [ ] **Step 8: Add Rich Blocks group**

Append to `src/components/JournalBlocks.jsx`:

```jsx
// ── Rich Blocks ───────────────────────────────────────────────────────────────

function Table({ table }) {
  const { headers, rows } = table;
  return (
    <div className="a-table-wrap">
      <table className="a-table">
        <thead><tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Accordion({ accordion }) {
  return (
    <details className="a-accordion">
      <summary>{accordion.title}</summary>
      <div className="a-accordion-body">{accordion.content}</div>
    </details>
  );
}

function Tabs({ tabs }) {
  const [active, setActive] = React.useState(0);
  return (
    <div className="a-tabs">
      <div className="a-tab-list" role="tablist">
        {tabs.map((tab, i) => (
          <button
            key={i}
            role="tab"
            className={`a-tab-btn${i === active ? ' active' : ''}`}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="a-tab-panel">{tabs[active]?.content}</div>
    </div>
  );
}

function Compare({ compare }) {
  return (
    <div className="a-compare">
      <div className="a-compare-side">
        <div className="a-compare-label">Before</div>
        <div className="a-compare-content">{compare.left}</div>
      </div>
      <div className="a-compare-side">
        <div className="a-compare-label">After</div>
        <div className="a-compare-content">{compare.right}</div>
      </div>
    </div>
  );
}

function Metric({ metric }) {
  return (
    <div className="a-metric">
      <div className="a-metric-value">{metric.value}</div>
      <div className="a-metric-label">{metric.label}</div>
    </div>
  );
}

function Timeline({ timeline }) {
  return (
    <div className="a-timeline">
      {timeline.map((item, i) => (
        <div key={i} className="a-tl-item">
          <div className="a-tl-dot" />
          <div className="a-tl-body">
            <div className="a-tl-title">{item.title}</div>
            {item.date && <div className="a-tl-date">{item.date}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function GitHubCard({ github }) {
  const url = `https://github.com/${github.repo}`;
  return (
    <a href={url} target="_blank" rel="noreferrer" className="a-gh-card">
      <div className="a-gh-card-left">
        <span className="a-gh-icon">⌥</span>
        <span className="a-gh-repo">{github.repo}</span>
      </div>
      <span className="a-gh-arrow">→</span>
    </a>
  );
}

function DemoButton({ demo }) {
  return (
    <a href={demo} target="_blank" rel="noreferrer" className="a-demo-btn">
      View Live Demo <span>↗</span>
    </a>
  );
}

function ProjectCard({ project }) {
  const { title, description, stack = [], github, demo } = project;
  return (
    <div className="a-project-card">
      <div className="a-project-title">{title}</div>
      <div className="a-project-desc">{description}</div>
      {stack.length > 0 && (
        <div className="a-project-stack">
          {stack.map((t, i) => <span key={i} className="a-tech-pill">{t}</span>)}
        </div>
      )}
      <div className="a-project-links">
        {github && <a href={github} target="_blank" rel="noreferrer" className="a-project-link">GitHub ↗</a>}
        {demo && <a href={demo} target="_blank" rel="noreferrer" className="a-project-link">Live Demo ↗</a>}
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Add TOC components**

Append to `src/components/JournalBlocks.jsx`:

```jsx
// ── TOC ───────────────────────────────────────────────────────────────────────

export function Toc({ body }) {
  const headings = body
    .filter(b => b.h || b.h2 || b.h3)
    .map(b => ({
      text: b.h || b.h2 || b.h3,
      level: b.h ? 1 : b.h2 ? 2 : 3,
      id: slug(b.h || b.h2 || b.h3),
    }));
  if (!headings.length) return null;
  return (
    <div className="a-toc">
      <div className="a-toc-label">Contents</div>
      <nav>
        {headings.map((h, i) => (
          <a key={i} href={`#${h.id}`} data-level={h.level}>{h.text}</a>
        ))}
      </nav>
    </div>
  );
}

export function TocMobile({ body }) {
  const headings = body
    .filter(b => b.h || b.h2 || b.h3)
    .map(b => ({
      text: b.h || b.h2 || b.h3,
      level: b.h ? 1 : b.h2 ? 2 : 3,
      id: slug(b.h || b.h2 || b.h3),
    }));
  if (!headings.length) return null;
  return (
    <details className="a-toc-details">
      <summary>Contents</summary>
      <div className="a-toc">
        <nav>
          {headings.map((h, i) => (
            <a key={i} href={`#${h.id}`} data-level={h.level}>{h.text}</a>
          ))}
        </nav>
      </div>
    </details>
  );
}
```

- [ ] **Step 10: Add BlockRenderer (the final export)**

Append to `src/components/JournalBlocks.jsx`:

```jsx
// ── BlockRenderer ─────────────────────────────────────────────────────────────

export function BlockRenderer({ block: b }) {
  if (b.toc)                    return null;
  if (b.h)                      return <Heading level={1} text={b.h} />;
  if (b.h2)                     return <Heading level={2} text={b.h2} />;
  if (b.h3)                     return <Heading level={3} text={b.h3} />;
  if (b.lead)                   return <Lead text={b.lead} />;
  if ('quote' in b)             return <Quote text={b.quote} cite={b.cite} />;
  if ('code' in b)              return <CodeBlock code={b.code} filename={b.filename} collapsible={b.collapsible} collapsed={b.collapsed} copyButton={b.copyButton} lineNumbers={b.lineNumbers} />;
  if (b.list)                   return <BulletList items={b.list} />;
  if (b.ordered)                return <OrderedList items={b.ordered} />;
  if (b.steps)                  return <Steps items={b.steps} />;
  if (b.prerequisites)          return <Prerequisites items={b.prerequisites} />;
  if (b.outcome)                return <Outcome items={b.outcome} />;
  if ('tree' in b)              return <FileTree tree={b.tree} />;
  if (b.file)                   return <FileLabel file={b.file} />;
  if (b.command)                return <Command command={b.command} />;
  if (b.image)                  return <ImageBlock image={b.image} caption={b.caption} />;
  if (b.video)                  return <VideoBlock video={b.video} caption={b.caption} />;
  if (b.embed)                  return <Embed embed={b.embed} />;
  if (b.architecture)           return <ArchDiagram architecture={b.architecture} />;
  if (b.alert)                  return <Alert type={b.alert.type} title={b.alert.title} content={b.alert.content} />;
  if (b.note)                   return <Alert type="info" content={b.note} />;
  if (b.warning)                return <Alert type="warning" content={b.warning} />;
  if (b.success)                return <Alert type="success" content={b.success} />;
  if (b.tip)                    return <Alert type="tip" content={b.tip} />;
  if (b.callout)                return <Alert type="callout" title={b.callout.title} content={b.callout.content} />;
  if (b.badge)                  return <Badge badge={b.badge} />;
  if (b.tags)                   return <Tags tags={b.tags} />;
  if (b.tech)                   return <TechStack tech={b.tech} />;
  if (b.link)                   return <ArticleLink link={b.link} />;
  if (b.author)                 return <AuthorBlock author={b.author} />;
  if (b.readingTime)            return <ReadingTime readingTime={b.readingTime} />;
  if (b.updated)                return <Updated updated={b.updated} />;
  if (b.table)                  return <Table table={b.table} />;
  if (b.accordion)              return <Accordion accordion={b.accordion} />;
  if (b.tabs)                   return <Tabs tabs={b.tabs} />;
  if (b.compare)                return <Compare compare={b.compare} />;
  if (b.metric)                 return <Metric metric={b.metric} />;
  if (b.timeline)               return <Timeline timeline={b.timeline} />;
  if (b.github)                 return <GitHubCard github={b.github} />;
  if (b.demo)                   return <DemoButton demo={b.demo} />;
  if (b.project)                return <ProjectCard project={b.project} />;
  if (b.divider)                return <Divider />;
  if (b.spacer !== undefined)   return <Spacer size={b.spacer} />;
  if ('p' in b)                 return <Paragraph text={b.p} />;
  return null;
}
```

- [ ] **Step 11: Commit**

```bash
git add src/components/JournalBlocks.jsx
git commit -m "feat: add JournalBlocks component with all block types"
```

---

## Task 3: Create JournalBlocks.css

**Files:**
- Create: `src/components/JournalBlocks.css`

- [ ] **Step 1: Write the complete CSS file**

Create `src/components/JournalBlocks.css` with the following content:

```css
/* ── Prism token overrides ──────────────────────────────────────────────────── */
.token.keyword, .token.rule          { color: #ffac2e; }
.token.string, .token.char           { color: #a0e0ab; }
.token.comment, .token.prolog,
.token.doctype, .token.cdata         { color: rgba(255,255,255,.32); font-style: italic; }
.token.number, .token.boolean,
.token.constant                      { color: #7eb8f7; }
.token.function                      { color: #c4b5fd; }
.token.class-name,
.token.maybe-class-name              { color: #f9ca74; }
.token.operator, .token.entity       { color: rgba(255,255,255,.65); }
.token.punctuation                   { color: rgba(255,255,255,.5); }
.token.parameter                     { color: #e8a87c; }
.token.property                      { color: #7eb8f7; }
.token.tag                           { color: #f87171; }
.token.attr-name                     { color: #ffac2e; }
.token.attr-value                    { color: #a0e0ab; }
.token.selector                      { color: #c4b5fd; }
.token.important                     { color: #f87171; font-weight: 700; }

/* ── Typography ─────────────────────────────────────────────────────────────── */
.a-h2 { font-size: clamp(18px,2.2vw,22px); font-weight:500; letter-spacing:-.02em; margin:36px 0 14px; color:rgba(255,255,255,.9); }
.a-h3 { font-size: clamp(15px,1.8vw,18px); font-weight:500; letter-spacing:-.01em; margin:28px 0 10px; color:rgba(255,255,255,.8); }
.a-lead { font-family:var(--ral); font-size:clamp(19px,2.2vw,24px); line-height:1.5; color:rgba(255,255,255,.75); margin-bottom:30px; }
.a-divider { border:none; border-top:1px solid var(--faint); margin:40px 0; }
.a-spacer-sm { height:24px; }
.a-spacer-md { height:48px; }
.a-spacer-lg { height:80px; }

/* ── Ordered list ────────────────────────────────────────────────────────────── */
.a-olist { list-style:none; margin:6px 0 30px; display:flex; flex-direction:column; gap:14px; counter-reset:ol; }
.a-olist li { position:relative; padding-left:36px; font-size:17px; line-height:1.6; color:rgba(255,255,255,.78); counter-increment:ol; }
.a-olist li::before { content:counter(ol); position:absolute; left:0; top:0; width:24px; height:24px; border-radius:50%; background:rgba(255,172,46,.15); border:1px solid rgba(255,172,46,.3); color:#ffac2e; font-size:12px; font-weight:600; display:flex; align-items:center; justify-content:center; }

/* ── Steps ───────────────────────────────────────────────────────────────────── */
.a-steps { display:flex; flex-direction:column; margin:20px 0 30px; position:relative; }
.a-steps::before { content:''; position:absolute; left:17px; top:34px; bottom:34px; width:1px; background:var(--faint); }
.a-step { display:flex; align-items:flex-start; gap:18px; padding:14px 0; }
.a-step-num { width:34px; height:34px; border-radius:50%; background:rgba(255,172,46,.12); border:1px solid rgba(255,172,46,.35); color:#ffac2e; font-size:13px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; position:relative; z-index:1; }
.a-step-text { font-size:16px; line-height:1.6; color:rgba(255,255,255,.78); padding-top:6px; }

/* ── Prerequisites / Outcome ─────────────────────────────────────────────────── */
.a-checklist { border:1px solid var(--faint); border-radius:12px; padding:20px 24px; margin:24px 0; }
.a-prereq { border-color:rgba(126,184,247,.3); background:rgba(126,184,247,.04); }
.a-outcome { border-color:rgba(160,224,171,.3); background:rgba(160,224,171,.04); }
.a-checklist-head { font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:14px; }
.a-checklist ul { list-style:none; display:flex; flex-direction:column; gap:10px; }
.a-checklist li { display:flex; align-items:center; gap:12px; font-size:15px; color:rgba(255,255,255,.8); }
.a-check { font-size:13px; flex-shrink:0; }
.a-prereq .a-check { color:#7eb8f7; }
.a-outcome .a-check { color:#a0e0ab; }

/* ── Code block ──────────────────────────────────────────────────────────────── */
.a-code-wrap { border:1px solid var(--hair); border-radius:12px; overflow:hidden; margin:30px 0; }
.a-code-header { display:flex; align-items:center; justify-content:space-between; padding:11px 16px; background:rgba(255,255,255,.04); border-bottom:1px solid var(--hair); }
.a-code-filename { font-family:'SFMono-Regular',ui-monospace,Menlo,monospace; font-size:12px; color:rgba(255,255,255,.5); }
.a-code-actions { display:flex; gap:8px; }
.a-code-btn { font-size:11px; letter-spacing:.06em; padding:5px 11px; border:1px solid var(--faint); border-radius:6px; color:rgba(255,255,255,.5); background:none; cursor:pointer; transition:border-color .2s,color .2s; }
.a-code-btn:hover { border-color:var(--border); color:#fff; }
.a-code-wrap .a-code { border-radius:0; border:none; margin:0; }

/* line numbers */
.a-code.a-ln { display:grid; grid-template-columns:44px 1fr; }
.a-ln-nums { display:flex; flex-direction:column; align-items:flex-end; padding:20px 12px 20px 0; border-right:1px solid var(--hair); margin-right:16px; color:var(--muted); font-family:'SFMono-Regular',ui-monospace,Menlo,monospace; font-size:12px; line-height:1.7; user-select:none; }

/* ── File tree ───────────────────────────────────────────────────────────────── */
.a-filetree { background:#000; border:1px solid var(--hair); border-radius:10px; padding:20px 22px; margin:30px 0; overflow-x:auto; }
.a-filetree pre { font-family:'SFMono-Regular',ui-monospace,Menlo,monospace; font-size:13.5px; line-height:1.7; color:rgba(255,255,255,.7); white-space:pre; margin:0; }

/* ── File label ──────────────────────────────────────────────────────────────── */
.a-filelabel { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,.06); border:1px solid var(--faint); border-radius:6px; padding:4px 12px; font-family:'SFMono-Regular',ui-monospace,Menlo,monospace; font-size:13px; color:rgba(255,255,255,.7); margin:6px 0; }

/* ── Command ─────────────────────────────────────────────────────────────────── */
.a-command { display:flex; align-items:center; justify-content:space-between; gap:16px; background:#000; border:1px solid var(--hair); border-radius:10px; padding:14px 18px; margin:24px 0; }
.a-command-inner { display:flex; align-items:center; gap:10px; overflow:hidden; }
.a-command-prompt { color:#ffac2e; font-family:'SFMono-Regular',ui-monospace,Menlo,monospace; font-size:14px; user-select:none; flex-shrink:0; }
.a-command-text { font-family:'SFMono-Regular',ui-monospace,Menlo,monospace; font-size:14px; color:#a0e0ab; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.a-command-copy { font-size:11px; padding:5px 11px; border:1px solid var(--faint); border-radius:6px; color:rgba(255,255,255,.5); background:none; cursor:pointer; transition:border-color .2s,color .2s; flex-shrink:0; }
.a-command-copy:hover { border-color:var(--border); color:#fff; }

/* ── Media ───────────────────────────────────────────────────────────────────── */
.a-img-wrap, .a-video-wrap { margin:34px 0; }
.a-img-wrap img { width:100%; border-radius:10px; display:block; }
.a-video-wrap video { width:100%; border-radius:10px; display:block; }
.a-caption { font-size:13px; color:var(--muted); margin-top:10px; text-align:center; font-style:italic; }
.a-embed { position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:10px; margin:34px 0; }
.a-embed iframe { position:absolute; inset:0; width:100%; height:100%; border:none; }
.a-arch { margin:34px 0; }
.a-arch-label { font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:10px; }
.a-arch img { width:100%; border-radius:10px; border:1px solid var(--faint); }

/* ── Alert ───────────────────────────────────────────────────────────────────── */
.a-alert { display:flex; gap:14px; border-radius:10px; padding:16px 18px; margin:26px 0; border:1px solid; }
.a-alert-icon { font-size:15px; flex-shrink:0; margin-top:2px; }
.a-alert-body { flex:1; min-width:0; }
.a-alert-title { font-size:14px; font-weight:600; margin-bottom:5px; }
.a-alert-text { font-size:15px; line-height:1.6; color:rgba(255,255,255,.8); }
.a-alert[data-type="info"]    { background:rgba(126,184,247,.07); border-color:rgba(126,184,247,.25); }
.a-alert[data-type="info"] .a-alert-icon,
.a-alert[data-type="info"] .a-alert-title    { color:#7eb8f7; }
.a-alert[data-type="warning"] { background:rgba(255,172,46,.07); border-color:rgba(255,172,46,.25); }
.a-alert[data-type="warning"] .a-alert-icon,
.a-alert[data-type="warning"] .a-alert-title { color:#ffac2e; }
.a-alert[data-type="error"]   { background:rgba(248,113,113,.07); border-color:rgba(248,113,113,.25); }
.a-alert[data-type="error"] .a-alert-icon,
.a-alert[data-type="error"] .a-alert-title   { color:#f87171; }
.a-alert[data-type="success"] { background:rgba(160,224,171,.07); border-color:rgba(160,224,171,.25); }
.a-alert[data-type="success"] .a-alert-icon,
.a-alert[data-type="success"] .a-alert-title { color:#a0e0ab; }
.a-alert[data-type="tip"]     { background:rgba(196,181,253,.07); border-color:rgba(196,181,253,.25); }
.a-alert[data-type="tip"] .a-alert-icon,
.a-alert[data-type="tip"] .a-alert-title     { color:#c4b5fd; }
.a-alert[data-type="callout"] { background:rgba(255,255,255,.04); border-color:var(--faint); }
.a-alert[data-type="callout"] .a-alert-title { color:#fff; }

/* ── Labels & Metadata ───────────────────────────────────────────────────────── */
.a-badge { display:inline-flex; align-items:center; padding:4px 12px; background:rgba(255,255,255,.08); border:1px solid var(--faint); border-radius:99px; font-size:12px; letter-spacing:.06em; color:rgba(255,255,255,.75); }
.a-tags { display:flex; flex-wrap:wrap; gap:8px; margin:16px 0; }
.a-techstack { display:flex; flex-wrap:wrap; gap:8px; margin:16px 0; }
.a-tech-pill { display:inline-flex; align-items:center; padding:5px 13px; background:rgba(255,172,46,.08); border:1px solid rgba(255,172,46,.2); border-radius:99px; font-size:13px; color:rgba(255,172,46,.9); }
.a-extlink { display:inline-flex; align-items:center; gap:5px; color:rgba(255,172,46,.9); text-decoration:none; border-bottom:1px solid rgba(255,172,46,.3); transition:border-color .2s; font-size:15px; margin:12px 0; }
.a-extlink:hover { border-color:rgba(255,172,46,.8); }
.a-extlink-arrow { font-size:11px; }
.a-meta-chip { display:inline-flex; align-items:center; gap:6px; font-size:12px; letter-spacing:.05em; color:var(--muted); margin:8px 0; }
.a-author { display:flex; align-items:center; gap:12px; margin:20px 0; }
.a-author-avatar { width:38px; height:38px; border-radius:50%; background:rgba(255,172,46,.15); border:1px solid rgba(255,172,46,.3); display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:600; color:#ffac2e; flex-shrink:0; }
.a-author-name { font-size:14px; color:rgba(255,255,255,.85); font-weight:500; }
.a-author-label { font-size:11px; letter-spacing:.07em; text-transform:uppercase; color:var(--muted); margin-top:2px; }

/* ── Table ───────────────────────────────────────────────────────────────────── */
.a-table-wrap { overflow-x:auto; margin:30px 0; border-radius:10px; border:1px solid var(--faint); }
.a-table { width:100%; border-collapse:collapse; font-size:14px; }
.a-table th { background:rgba(255,255,255,.04); padding:12px 16px; text-align:left; font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); border-bottom:1px solid var(--faint); white-space:nowrap; }
.a-table td { padding:12px 16px; border-bottom:1px solid rgba(255,255,255,.05); color:rgba(255,255,255,.78); }
.a-table tr:last-child td { border-bottom:none; }
.a-table tr:hover td { background:rgba(255,255,255,.02); }

/* ── Accordion ───────────────────────────────────────────────────────────────── */
.a-accordion { border:1px solid var(--faint); border-radius:10px; margin:20px 0; overflow:hidden; }
.a-accordion summary { padding:16px 20px; cursor:pointer; font-size:16px; font-weight:500; color:rgba(255,255,255,.85); display:flex; align-items:center; justify-content:space-between; list-style:none; user-select:none; transition:background .2s; }
.a-accordion summary::-webkit-details-marker { display:none; }
.a-accordion summary:hover { background:rgba(255,255,255,.03); }
.a-accordion summary::after { content:'↓'; font-size:13px; color:var(--muted); transition:transform .3s var(--ease); }
.a-accordion[open] summary::after { transform:rotate(180deg); }
.a-accordion-body { padding:16px 20px 18px; font-size:15px; line-height:1.7; color:rgba(255,255,255,.72); border-top:1px solid var(--faint); }

/* ── Tabs ────────────────────────────────────────────────────────────────────── */
.a-tabs { margin:26px 0; }
.a-tab-list { display:flex; border-bottom:1px solid var(--faint); overflow-x:auto; }
.a-tab-btn { padding:10px 18px; font-size:13px; letter-spacing:.04em; color:var(--muted); background:none; border:none; border-bottom:2px solid transparent; cursor:pointer; transition:color .2s,border-color .2s; white-space:nowrap; margin-bottom:-1px; }
.a-tab-btn.active { color:#fff; border-bottom-color:#ffac2e; }
:root[data-grad="teal"]   .a-tab-btn.active { border-bottom-color:#4ec9b0; }
:root[data-grad="aurora"] .a-tab-btn.active { border-bottom-color:#c4b5fd; }
:root[data-grad="ember"]  .a-tab-btn.active { border-bottom-color:#f87171; }
.a-tab-btn:hover:not(.active) { color:rgba(255,255,255,.6); }
.a-tab-panel { padding:20px 0; font-size:15px; line-height:1.7; color:rgba(255,255,255,.78); }

/* ── Compare ─────────────────────────────────────────────────────────────────── */
.a-compare { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:26px 0; }
.a-compare-side { border:1px solid var(--faint); border-radius:10px; overflow:hidden; }
.a-compare-label { padding:8px 16px; background:rgba(255,255,255,.04); border-bottom:1px solid var(--faint); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
.a-compare-content { padding:16px; font-size:14px; color:rgba(255,255,255,.75); line-height:1.6; }
@media(max-width:580px) { .a-compare { grid-template-columns:1fr; } }

/* ── Metric ──────────────────────────────────────────────────────────────────── */
.a-metric { display:inline-flex; flex-direction:column; gap:4px; padding:20px 28px; border:1px solid var(--faint); border-radius:12px; margin:16px 0; }
.a-metric-value { font-size:clamp(28px,4vw,42px); font-weight:300; letter-spacing:-.03em; color:#fff; }
.a-metric-label { font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); }

/* ── Timeline ────────────────────────────────────────────────────────────────── */
.a-timeline { display:flex; flex-direction:column; margin:24px 0; position:relative; }
.a-timeline::before { content:''; position:absolute; left:7px; top:16px; bottom:16px; width:1px; background:var(--faint); }
.a-tl-item { display:flex; gap:20px; padding:10px 0; align-items:flex-start; }
.a-tl-dot { width:15px; height:15px; border-radius:50%; border:2px solid rgba(255,172,46,.5); background:#050505; flex-shrink:0; margin-top:4px; position:relative; z-index:1; }
.a-tl-body { flex:1; }
.a-tl-title { font-size:15px; color:rgba(255,255,255,.85); font-weight:500; }
.a-tl-date { font-size:12px; color:var(--muted); letter-spacing:.04em; margin-top:3px; }

/* ── GitHub card ─────────────────────────────────────────────────────────────── */
.a-gh-card { display:flex; align-items:center; justify-content:space-between; gap:16px; border:1px solid var(--faint); border-radius:12px; padding:18px 22px; margin:20px 0; transition:border-color .3s,background .3s; text-decoration:none; color:inherit; }
.a-gh-card:hover { border-color:var(--border); background:rgba(255,255,255,.02); }
.a-gh-card-left { display:flex; align-items:center; gap:13px; }
.a-gh-icon { font-size:20px; color:rgba(255,255,255,.55); }
.a-gh-repo { font-family:'SFMono-Regular',ui-monospace,Menlo,monospace; font-size:14px; color:rgba(255,172,46,.9); }
.a-gh-arrow { color:rgba(255,255,255,.3); font-size:16px; transition:transform .3s var(--ease); }
.a-gh-card:hover .a-gh-arrow { transform:translateX(4px); }

/* ── Demo button ─────────────────────────────────────────────────────────────── */
.a-demo-btn { display:inline-flex; align-items:center; gap:8px; padding:12px 22px; border:1px solid var(--faint); border-radius:10px; color:rgba(255,255,255,.8); text-decoration:none; font-size:14px; transition:border-color .3s,color .3s,background .3s; margin:16px 0; }
.a-demo-btn:hover { border-color:var(--border); color:#fff; background:rgba(255,255,255,.03); }
.a-demo-btn span { font-size:12px; }

/* ── Project card ────────────────────────────────────────────────────────────── */
.a-project-card { border:1px solid var(--faint); border-radius:14px; padding:24px 26px; margin:24px 0; transition:border-color .3s,background .3s; }
.a-project-card:hover { border-color:var(--border); background:rgba(255,255,255,.02); }
.a-project-title { font-size:20px; font-weight:500; letter-spacing:-.02em; margin-bottom:8px; color:#fff; }
.a-project-desc { font-size:15px; line-height:1.6; color:rgba(255,255,255,.65); margin-bottom:16px; }
.a-project-stack { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:18px; }
.a-project-links { display:flex; gap:14px; flex-wrap:wrap; }
.a-project-link { font-size:13px; color:rgba(255,172,46,.9); text-decoration:none; border-bottom:1px solid rgba(255,172,46,.25); padding-bottom:1px; transition:border-color .2s; }
.a-project-link:hover { border-color:rgba(255,172,46,.7); }

/* ── TOC ─────────────────────────────────────────────────────────────────────── */
.a-toc-label { font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:14px; }
.a-toc nav { display:flex; flex-direction:column; gap:2px; }
.a-toc a { font-size:13px; line-height:1.5; color:rgba(255,255,255,.45); text-decoration:none; transition:color .2s,border-color .2s; padding:4px 0 4px 12px; border-left:2px solid transparent; display:block; }
.a-toc a:hover { color:rgba(255,255,255,.8); }
.a-toc a[data-level="2"] { padding-left:22px; font-size:12px; }
.a-toc a[data-level="3"] { padding-left:34px; font-size:12px; }

.a-toc-details { margin-bottom:30px; border:1px solid var(--faint); border-radius:10px; overflow:hidden; }
.a-toc-details summary { padding:12px 16px; cursor:pointer; font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); list-style:none; user-select:none; }
.a-toc-details summary::-webkit-details-marker { display:none; }
.a-toc-details .a-toc { padding:12px 16px 16px; }
```

- [ ] **Step 2: Commit**

```bash
git add src/components/JournalBlocks.css
git commit -m "feat: add JournalBlocks styles with Prism theme and all block CSS"
```

---

## Task 4: Update Sections.jsx — wire BlockRenderer + two-column TOC layout

**Files:**
- Modify: `src/components/Sections.jsx:149-162` (remove `fmt`)
- Modify: `src/components/Sections.jsx:195-268` (update `Article`)

- [ ] **Step 1: Add imports at the top of Sections.jsx**

In `src/components/Sections.jsx`, find the existing import line:

```jsx
import React from 'react';
import { PORTFOLIO } from '../data/config';
import { Field, SMMark } from './Field';
```

Replace with:

```jsx
import React from 'react';
import { PORTFOLIO } from '../data/config';
import { Field, SMMark } from './Field';
import { BlockRenderer, Toc, TocMobile } from './JournalBlocks';
```

- [ ] **Step 2: Remove the local `fmt` function**

In `src/components/Sections.jsx`, find and **delete** lines 149–162 (the entire `fmt` function):

```jsx
function fmt(text) {
  const out = []; let key = 0;
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) out.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    else out.push(<em key={key++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
```

- [ ] **Step 3: Replace the Article component**

In `src/components/Sections.jsx`, find the entire `export function Article` block (lines ~195–268) and replace it with:

```jsx
export function Article({ index, onClose, onNav }) {
  const open = index != null;
  const post = open ? PORTFOLIO.journal[index] : null;
  const scroller = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      if (scroller.current) scroller.current.scrollTop = 0;
      const onKey = (e) => {
        if (e.key === 'Escape') onClose();
        else if (e.key === 'ArrowRight') onNav(1);
        else if (e.key === 'ArrowLeft') onNav(-1);
      };
      addEventListener('keydown', onKey);
      return () => { removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
    }
  }, [open, index]);

  const total = PORTFOLIO.journal ? PORTFOLIO.journal.length : 0;
  const next = open ? PORTFOLIO.journal[(index + 1) % total] : null;
  const hasToc = post?.body?.some(b => b.toc);

  return (
    <div className={`article${open ? ' open' : ''}`} aria-hidden={open ? 'false' : 'true'}>
      <div className="article-scrim" onClick={onClose} />
      {post && (
        <button className="article-close" onClick={onClose} aria-label="Close article">
          <span />Close
        </button>
      )}
      <div className="article-sheet" ref={scroller} data-lenis-prevent="">
        {post && (
          <article className={`article-body${hasToc ? ' has-toc' : ''}`}>
            <div className="a-content">
              {hasToc && <TocMobile body={post.body} />}
              <div className="a-meta">
                <span className="a-tag">{post.tag}</span>
                <span>{post.date}</span>
                <span>{post.read} read</span>
              </div>
              <h1 className="a-title">{post.title}</h1>
              <p className="a-lede">{post.excerpt}</p>
              <div className="a-rule" />
              {post.body.map((b, i) => (
                <BlockRenderer key={i} block={b} />
              ))}
              <div className="a-end">
                <span className="a-mark"><SMMark size={26} /></span>
                <span>Shamit Mishra · {post.date}</span>
              </div>
              {next && (
                <button className="a-next" onClick={() => onNav(1)} data-cursor="view">
                  <span className="a-next-l">Next</span>
                  <span className="a-next-t">{next.title}</span>
                  <span className="a-next-arrow">→</span>
                </button>
              )}
            </div>
            {hasToc && (
              <aside className="a-toc-sidebar">
                <Toc body={post.body} />
              </aside>
            )}
          </article>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Sections.jsx
git commit -m "feat: wire BlockRenderer into Article, add TOC layout support"
```

---

## Task 5: Add two-column TOC layout CSS to index.css

**Files:**
- Modify: `src/index.css` (append at end)

- [ ] **Step 1: Append layout CSS to index.css**

Open `src/index.css` and append the following at the very end of the file:

```css
/* two-column layout when article has TOC */
.article-body.has-toc{max-width:1060px;display:grid;grid-template-columns:1fr 240px;gap:60px;align-items:start}
.a-content{min-width:0}
.a-toc-sidebar{position:sticky;top:100px;max-height:calc(100vh - 120px);overflow-y:auto}
.a-toc-sidebar::-webkit-scrollbar{width:4px}
.a-toc-sidebar::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
@media(max-width:768px){
  .article-body.has-toc{display:block;max-width:720px}
  .a-toc-sidebar{display:none}
}
```

- [ ] **Step 2: Start dev server and visually verify**

```bash
npm run dev
```

Open `http://localhost:5173` in a browser. Click any journal post and confirm:
- Existing posts (backpressure, AI design, finishing things) render correctly via `BlockRenderer`
- `h`, `p`, `quote`, `code`, `list` blocks all display the same as before
- No console errors

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add two-column article layout for TOC sidebar"
```

---

## Task 6: Add demo journal entry to config.js

This entry exercises all major block types so you can visually verify them in one place.

**Files:**
- Modify: `src/data/config.js`

- [ ] **Step 1: Add demo entry to the journal array**

In `src/data/config.js`, find the `journal: [` array and prepend the following entry as the first item (before the existing `num: "01"` entry):

```js
{
  num: "00",
  title: "Block System Demo",
  excerpt: "A reference post demonstrating every content block type available in the journal.",
  date: "Jun 2026",
  read: "2 min",
  tag: "Meta",
  body: [
    { toc: true },
    { author: "Shamit" },
    { readingTime: "2 min" },
    { updated: "Jun 2026" },
    { spacer: "sm" },

    { h: "Typography" },
    { lead: "This is a lead paragraph — larger, italic, used as a section opener." },
    { p: "Normal body paragraph. Supports **bold** and *italic* inline formatting." },
    { h2: "Second-level heading" },
    { h3: "Third-level heading" },
    { quote: "Ship fast.", cite: "Working Principle" },
    { divider: true },

    { h: "Lists & Steps" },
    { list: ["Item one", "Item two", "Item **three** (bold)"] },
    { ordered: ["First step", "Second step", "Third step"] },
    { steps: ["Create project", "Install dependencies", "Configure environment", "Deploy"] },
    { prerequisites: ["Node.js installed", "MongoDB running", "Basic React knowledge"] },
    { outcome: ["JWT Authentication", "Protected Routes", "MongoDB Integration"] },

    { h: "Code Blocks" },
    { code: "npm install express mongoose dotenv", filename: "terminal" },
    { command: "npm run dev" },
    { file: "src/controllers/authController.js" },
    {
      code: "const express = require('express')\nconst app = express()\napp.listen(3000)",
      filename: "server.js",
      collapsible: true,
      copyButton: true,
      lineNumbers: true,
    },
    {
      code: "SECRET_KEY=your-secret\nMONGO_URI=mongodb://localhost:27017/app",
      filename: ".env",
      collapsed: true,
    },
    {
      tree: `backend/\n├── controllers/\n│   └── authController.js\n├── models/\n│   └── User.js\n└── server.js`,
    },

    { h: "Callouts & Alerts" },
    { note: "MongoDB must be running before starting the backend." },
    { warning: "Never commit your .env file to version control." },
    { success: "Authentication setup complete." },
    { tip: "Use Postman to test your API endpoints before connecting the frontend." },
    { alert: { type: "error", title: "Breaking Change", content: "This API endpoint was removed in v2.0. Use /api/v2/auth instead." } },
    { callout: { title: "Why JWT?", content: "JWT allows stateless authentication — no session storage required on the server." } },

    { h: "Labels & Metadata" },
    { badge: "Beginner" },
    { tags: ["React", "Node.js", "MongoDB", "JWT"] },
    { tech: ["React", "Express", "MongoDB", "Tailwind"] },
    { link: { text: "GitHub Repository", href: "https://github.com/iamshamit" } },

    { h: "Rich Blocks" },
    {
      table: {
        headers: ["Package", "Purpose", "Version"],
        rows: [
          ["express", "Backend framework", "4.18"],
          ["mongoose", "MongoDB ODM", "7.0"],
          ["jsonwebtoken", "JWT signing", "9.0"],
        ],
      },
    },
    { accordion: { title: "How JWT Works", content: "JWT (JSON Web Token) is a compact, URL-safe token format. It contains a header, payload, and signature. The server signs it with a secret; the client sends it back on every request." } },
    {
      tabs: [
        { label: "JavaScript", content: "const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' });" },
        { label: "TypeScript", content: "const token: string = jwt.sign({ id: user._id } as JwtPayload, process.env.SECRET_KEY!, { expiresIn: '7d' });" },
      ],
    },
    { compare: { left: "Storing passwords in plain text", right: "Hashing with bcrypt (salt rounds: 12)" } },
    { metric: { label: "Default token expiry", value: "7 days" } },
    {
      timeline: [
        { title: "Project started", date: "Jan 2026" },
        { title: "Auth system complete", date: "Feb 2026" },
        { title: "Production launch", date: "Mar 2026" },
      ],
    },
    { github: { repo: "iamshamit/portfolio-react" } },
    { demo: "https://shamit.is-a.dev" },
    {
      project: {
        title: "Nexara",
        description: "A full-stack freelancing platform with real-time messaging and escrow payments.",
        stack: ["React", "Node.js", "MongoDB", "Socket.io"],
        github: "https://github.com/iamshamit/Freelancer",
        demo: "https://nexara.iamshamit.xyz",
      },
    },

    { spacer: "md" },
    { divider: true },
    { p: "End of demo." },
  ],
},
```

Also update `journalLen` in `src/App.jsx` from `4` to `5` to include the new entry:

Find in `src/App.jsx`:
```jsx
const journalLen = 4;
```

Replace with:
```jsx
const journalLen = 5;
```

- [ ] **Step 2: Open the demo post and verify each block group**

With `npm run dev` running, open `http://localhost:5173`, scroll to the Journal section, and open "Block System Demo". Check:

- **TOC** appears as sticky sidebar on desktop, `<details>` on mobile
- **Author / ReadingTime / Updated** chips render correctly
- **h / h2 / h3** headings render at three distinct sizes with IDs
- **lead** renders larger and italic
- **list / ordered / steps / prerequisites / outcome** all render correctly
- **code blocks** — plain, with filename header, collapsible, line numbers, copy button all work
- **command** has `$` prefix and copy button
- **file** renders as a pill
- **tree** renders monospace tree structure
- **note / warning / success / tip / alert / callout** all render with correct colors
- **badge / tags / tech** render as pill rows
- **table** renders with dark header, scrolls on mobile
- **accordion** toggles open/closed
- **tabs** switch content on click, active tab has amber underline
- **compare** shows two-column Before/After
- **metric** shows large stat value
- **timeline** shows vertical list with dots and connecting line
- **github** renders as static card with `→`
- **demo** renders as ghost button
- **project** renders as rich card with stack pills and links

- [ ] **Step 3: Commit**

```bash
git add src/data/config.js src/App.jsx
git commit -m "feat: add block system demo journal entry for visual verification"
```

---

## Task 7: Write JOURNAL_GUIDE.md

**Files:**
- Create: `JOURNAL_GUIDE.md` (repo root)

- [ ] **Step 1: Create the guide**

Create `JOURNAL_GUIDE.md` at `E:/portfolio-react/JOURNAL_GUIDE.md`:

```markdown
# Journal Writing Guide

Reference for every content block available in the journal system. Copy any example directly into a `body: []` array in `src/data/config.js`.

---

## Post structure

Every journal entry in `PORTFOLIO.journal` follows this shape:

```js
{
  num: "05",           // display number, zero-padded string
  title: "Post Title",
  excerpt: "One-sentence hook shown on the journal list.",
  date: "Jun 2026",   // shown in list and article header
  read: "8 min",      // reading time estimate
  tag: "Tutorial",    // category label
  body: [
    // ...block objects, one per element
  ],
}
```

---

## Typography

### `{ h }` — Large section heading
```js
{ h: "Getting Started" }
```

### `{ h2 }` — Medium heading
```js
{ h2: "Installation" }
```

### `{ h3 }` — Small subsection heading
```js
{ h3: "Environment Variables" }
```

### `{ p }` — Body paragraph
Supports `**bold**` and `*italic*` inline.
```js
{ p: "This is a paragraph with **bold** and *italic* text." }
```

### `{ lead }` — Large intro paragraph
```js
{ lead: "A highlighted introduction paragraph with larger text." }
```

### `{ quote }` — Blockquote with optional attribution
```js
{ quote: "Ship fast.", cite: "Working Principle" }
```

### `{ divider }` — Horizontal rule
```js
{ divider: true }
```

### `{ spacer }` — Vertical whitespace
```js
{ spacer: "sm" }   // 24px
{ spacer: "md" }   // 48px
{ spacer: "lg" }   // 80px
```

---

## Lists & Steps

### `{ list }` — Unordered bullet list
```js
{ list: ["Item one", "Item two", "Item **three**"] }
```

### `{ ordered }` — Numbered list
```js
{ ordered: ["First step", "Second step", "Third step"] }
```

### `{ steps }` — Visual stepper with numbered circles
```js
{ steps: ["Create project", "Install dependencies", "Configure database", "Deploy"] }
```

### `{ prerequisites }` — Checklist with "Prerequisites" header
```js
{ prerequisites: ["Node.js installed", "MongoDB running", "Basic React knowledge"] }
```

### `{ outcome }` — "What you'll build" checklist
```js
{ outcome: ["JWT Authentication", "Protected Routes", "MongoDB Integration"] }
```

---

## Code

### `{ code }` — Basic syntax-highlighted code block
Language is auto-detected from the `filename` extension.
```js
{ code: "npm install express" }
```

### `{ code }` — Full-featured code block
```js
{
  code: "const app = express()\napp.listen(3000)",
  filename: "server.js",    // shows header bar + detects language
  collapsible: true,        // adds a Hide/Show toggle (starts expanded)
  collapsed: true,          // starts collapsed (implies collapsible)
  copyButton: true,         // adds Copy button in header
  lineNumbers: true,        // shows line numbers on the left
}
```

**Supported filename extensions and their languages:**
| Extension | Language |
|---|---|
| `.js` | JavaScript |
| `.jsx` | JSX |
| `.ts` | TypeScript |
| `.tsx` | TSX |
| `.sh` / `.bash` | Bash |
| `.json` | JSON |
| `.css` | CSS |
| `.html` / `.htm` | HTML |
| `.py` | Python |
| `.go` | Go |
| `.sql` | SQL |

### `{ tree }` — File/folder structure
```js
{
  tree: `backend/
├── controllers/
│   └── authController.js
├── models/
│   └── User.js
└── server.js`
}
```

### `{ file }` — Filename label/pill
```js
{ file: "src/controllers/authController.js" }
```

### `{ command }` — Terminal command with copy button
Always shows a `$` prefix and a copy button.
```js
{ command: "npm run dev" }
```

---

## Media & Embeds

### `{ image }` — Full-width image with optional caption
```js
{ image: "/images/auth-flow.png", caption: "Authentication flow diagram" }
```

### `{ video }` — Embedded video player
```js
{ video: "/videos/demo.mp4", caption: "Project walkthrough" }
```

### `{ embed }` — External embed (YouTube or Loom)
```js
{ embed: { type: "youtube", url: "https://youtube.com/watch?v=dQw4w9WgXcQ" } }
{ embed: { type: "loom", url: "https://loom.com/share/abc123" } }
```

### `{ architecture }` — System diagram image
Renders with an "Architecture" label above.
```js
{ architecture: "/images/system-diagram.png" }
```

---

## Callouts & Alerts

### `{ note }` — Information callout (blue)
```js
{ note: "MongoDB must be running before starting the backend." }
```

### `{ warning }` — Warning callout (amber)
```js
{ warning: "Never commit your .env file to version control." }
```

### `{ success }` — Success callout (green)
```js
{ success: "Authentication setup is complete." }
```

### `{ tip }` — Pro-tip callout (purple)
```js
{ tip: "Use Postman to test your API endpoints before connecting the frontend." }
```

### `{ alert }` — Universal alert (canonical form)
Supports `info`, `warning`, `error`, `success`. Optional `title`.
```js
{
  alert: {
    type: "error",
    title: "Breaking Change",
    content: "This endpoint was removed in v2. Use /api/v2/auth instead."
  }
}
```

### `{ callout }` — Titled highlight box
```js
{
  callout: {
    title: "Why JWT?",
    content: "JWT allows stateless authentication — no server-side session storage needed."
  }
}
```

---

## Labels, Links & Metadata

### `{ badge }` — Single pill tag
```js
{ badge: "Beginner" }
```

### `{ tags }` — Multiple pill tags
```js
{ tags: ["React", "Node.js", "MongoDB"] }
```

### `{ tech }` — Technology stack pills (amber-tinted)
```js
{ tech: ["React", "Express", "MongoDB", "Tailwind"] }
```

### `{ link }` — Styled external link
```js
{ link: { text: "GitHub Repository", href: "https://github.com/iamshamit" } }
```

### `{ author }` — Author block
```js
{ author: "Shamit" }
```

### `{ readingTime }` — Reading time chip
```js
{ readingTime: "15 min" }
```

### `{ updated }` — Last updated chip
```js
{ updated: "May 2026" }
```

---

## Rich Blocks

### `{ table }` — Responsive data table
```js
{
  table: {
    headers: ["Package", "Purpose"],
    rows: [
      ["express", "Backend framework"],
      ["mongoose", "MongoDB ODM"],
      ["jsonwebtoken", "JWT signing"],
    ]
  }
}
```

### `{ accordion }` — Expandable section
```js
{
  accordion: {
    title: "How JWT Works",
    content: "JWT contains a header, payload, and signature. The server signs it; the client sends it back on every request."
  }
}
```

### `{ tabs }` — Tabbed content switcher
```js
{
  tabs: [
    { label: "JavaScript", content: "const token = jwt.sign({ id }, secret, { expiresIn: '7d' });" },
    { label: "TypeScript", content: "const token: string = jwt.sign({ id } as JwtPayload, secret!, { expiresIn: '7d' });" },
  ]
}
```

### `{ compare }` — Side-by-side before/after comparison
```js
{
  compare: {
    left: "Storing passwords in plain text — never do this.",
    right: "Hashing with bcrypt at 12 salt rounds before storing."
  }
}
```

### `{ metric }` — Single statistic display
```js
{ metric: { label: "Default token expiry", value: "7 days" } }
```

### `{ timeline }` — Vertical project timeline
```js
{
  timeline: [
    { title: "Project started", date: "Jan 2026" },
    { title: "Auth complete", date: "Feb 2026" },
    { title: "Production launch", date: "Mar 2026" },
  ]
}
```

### `{ github }` — GitHub repository card (static)
```js
{ github: { repo: "iamshamit/portfolio-react" } }
```

### `{ demo }` — Live demo button
```js
{ demo: "https://nexara.iamshamit.xyz" }
```

### `{ project }` — Rich project card
```js
{
  project: {
    title: "Nexara",
    description: "A full-stack freelancing platform with real-time messaging and escrow payments.",
    stack: ["React", "Node.js", "MongoDB", "Socket.io"],
    github: "https://github.com/iamshamit/Freelancer",  // optional
    demo: "https://nexara.iamshamit.xyz",               // optional
  }
}
```

---

## Navigation

### `{ toc: true }` — Auto-generated table of contents
Place this **anywhere** in the `body` array (typically first). It extracts all `h`, `h2`, and `h3` headings and renders a sticky sidebar on desktop and a collapsible `<details>` on mobile.

```js
{ toc: true }
```

The TOC only appears if the post actually has heading blocks. No headings → no TOC rendered.

---

## Full example post

```js
{
  num: "05",
  title: "Building a REST API with Express",
  excerpt: "Step-by-step guide to building and securing a REST API using Node.js, Express, and MongoDB.",
  date: "Jun 2026",
  read: "12 min",
  tag: "Tutorial",
  body: [
    { toc: true },
    { author: "Shamit" },
    { readingTime: "12 min" },
    { tags: ["Node.js", "Express", "MongoDB", "REST API"] },
    { spacer: "sm" },

    { lead: "In this guide we'll build a secure REST API from scratch — no hand-waving, no placeholders." },

    { outcome: ["A working CRUD API", "JWT authentication middleware", "MongoDB with Mongoose"] },

    { h: "Prerequisites" },
    { prerequisites: ["Node.js 18+", "MongoDB installed or Atlas account", "Basic JavaScript knowledge"] },

    { h: "Project Setup" },
    { steps: ["Create project folder", "Initialise npm", "Install dependencies"] },
    { command: "mkdir my-api && cd my-api && npm init -y" },
    { command: "npm install express mongoose jsonwebtoken bcrypt dotenv" },

    { h: "Project Structure" },
    {
      tree: `my-api/\n├── controllers/\n├── middleware/\n├── models/\n├── routes/\n└── server.js`
    },

    { h: "Environment Variables" },
    { warning: "Never commit .env to Git. Add it to .gitignore immediately." },
    {
      code: "PORT=5000\nMONGO_URI=mongodb://localhost:27017/myapi\nJWT_SECRET=supersecret",
      filename: ".env",
      collapsed: true,
    },

    { h: "Server Entry Point" },
    {
      code: `import express from 'express'\nimport mongoose from 'mongoose'\nimport dotenv from 'dotenv'\n\ndotenv.config()\nconst app = express()\napp.use(express.json())\n\nmongoose.connect(process.env.MONGO_URI)\n  .then(() => app.listen(process.env.PORT, () => console.log('Running')))\n  .catch(console.error)`,
      filename: "server.js",
      copyButton: true,
      lineNumbers: true,
    },

    { h: "Authentication" },
    { note: "We use bcrypt with 12 salt rounds. Never store plain-text passwords." },
    { quote: "A system that stores plain passwords will eventually be breached.", cite: "Every security audit ever" },

    { h: "Performance Stats" },
    { metric: { label: "Avg. response time", value: "18ms" } },

    { h: "Resources" },
    { github: { repo: "iamshamit/portfolio-react" } },
    { demo: "https://shamit.is-a.dev" },
    { link: { text: "Express documentation", href: "https://expressjs.com" } },
  ],
},
```
```

- [ ] **Step 2: Commit**

```bash
git add JOURNAL_GUIDE.md
git commit -m "docs: add JOURNAL_GUIDE.md block reference cheat sheet"
```

---

## Task 8: Final verification and cleanup

- [ ] **Step 1: Run the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify all existing posts still work**

Open each of the four existing posts (MERN Auth, Backpressure, AI Design, On Finishing Things) and confirm:
- All existing `h`, `p`, `quote`, `code`, `list` blocks render correctly
- No visual regressions in the article header, close button, or "Next" footer

- [ ] **Step 3: Verify the demo post (Block System Demo)**

Open "Block System Demo" and confirm the complete block checklist from Task 6 Step 2.

- [ ] **Step 4: Check mobile layout**

Resize browser to <768px. Confirm:
- The sticky TOC sidebar is hidden
- The mobile TOC `<details>` disclosure appears at the top of the demo post
- Article content renders in single column

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: jornal content block system — all blocks, Prism highlighting, sticky TOC"
```
```
