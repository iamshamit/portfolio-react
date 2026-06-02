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
