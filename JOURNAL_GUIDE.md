# Journal Block Reference

This file is a copy-paste cheat sheet for every content block available in the journal system. When writing a new journal entry, add block objects to the `body: []` array of a post inside `src/data/config.js`.

---

## Post Structure

Every post in the `journal` array follows this shape:

```js
{
  num: "05",                          // display number / sort key (string)
  title: "Your Post Title",           // card headline
  excerpt: "One-sentence description shown on the card.",
  date: "Jun 2026",                   // human-readable month + year
  read: "6 min",                      // estimated reading time
  tag: "Tutorial",                    // single category label
  body: [                             // ← all content blocks go here
    // ...blocks
  ],
}
```

---

## Typography

### `h` — Large section heading

```js
{ h: "Section Title" }
```

Renders as the largest heading (`<h1>`-weight). Use to open major sections.

---

### `h2` — Medium heading

```js
{ h2: "Subsection Title" }
```

Second-level heading. Use inside a section started with `h`.

---

### `h3` — Small subsection heading

```js
{ h3: "Minor Heading" }
```

Third-level heading for granular groupings.

---

### `p` — Body paragraph

```js
{ p: "This is a paragraph. Supports **bold** and *italic* inline." }
```

Standard body text. Inline markdown (`**bold**`, `*italic*`) is processed.

---

### `lead` — Large intro paragraph

```js
{ lead: "An opening sentence that sets the scene for the section below." }
```

Larger, italicised text. Use once per major section as a lede.

---

### `quote` — Blockquote with optional attribution

```js
{ quote: "Ship fast, learn faster.", cite: "Working Principle" }
```

Renders as a styled pull-quote. `cite` is optional — omit the key to show no attribution.

---

### `divider` — Horizontal rule

```js
{ divider: true }
```

Full-width decorative separator line.

---

### `spacer` — Vertical gap

```js
{ spacer: "sm" }   // 24 px
{ spacer: "md" }   // 48 px
{ spacer: "lg" }   // 80 px
```

Inserts blank vertical space. Values: `"sm"` | `"md"` | `"lg"`.

---

## Lists & Steps

### `list` — Unordered bullet list

```js
{ list: ["Item one", "Item two", "Item **three** (bold)"] }
```

Bulleted list. Each item supports inline markdown.

---

### `ordered` — Numbered list

```js
{ ordered: ["First step", "Second step", "Third step"] }
```

Standard ordered (`<ol>`) list.

---

### `steps` — Visual stepper

```js
{
  steps: [
    "Create the project",
    "Install dependencies",
    "Configure environment",
    "Deploy to production",
  ]
}
```

Numbered circles connected by a vertical line. Ideal for multi-step processes.

---

### `prerequisites` — Checklist with "Prerequisites" header

```js
{
  prerequisites: [
    "Node.js 18+ installed",
    "MongoDB running locally or Atlas account",
    "Basic knowledge of React",
  ]
}
```

Renders a checklist block with a "Prerequisites" title automatically prepended.

---

### `outcome` — "What you'll build" checklist

```js
{
  outcome: [
    "JWT Authentication",
    "Protected Routes",
    "MongoDB Integration",
  ]
}
```

Checklist block describing the end result. Prepends a "What you'll build" title automatically.

---

## Code

### `code` — Basic code block

```js
{ code: "npm install express mongoose dotenv" }
```

Syntax-highlighted code block. Language is auto-detected from the content when no `filename` is provided.

---

### Full-featured code block

```js
{
  code: "const app = require('express')()\napp.listen(3000)",
  filename: "server.js",
  collapsible: true,
  collapsed: false,
  copyButton: true,
  lineNumbers: true,
}
```

All options:

| Key | Type | Default | Description |
|---|---|---|---|
| `code` | string | — | The code content (required) |
| `filename` | string | — | Shown in the tab bar; also drives language detection |
| `collapsible` | boolean | `false` | Adds a toggle to show/hide the block |
| `collapsed` | boolean | `false` | Starts the block in a collapsed state |
| `copyButton` | boolean | `false` | Shows a one-click copy button |
| `lineNumbers` | boolean | `false` | Displays line numbers in the gutter |

**Filename → language mapping:**

| Extension | Language |
|---|---|
| `.js` | JavaScript |
| `.jsx` | JSX |
| `.ts` | TypeScript |
| `.tsx` | TSX |
| `.sh`, `.bash` | Bash |
| `.json` | JSON |
| `.css` | CSS |
| `.html` | HTML |
| `.py` | Python |
| `.go` | Go |
| `.sql` | SQL |

---

### `tree` — File/folder structure viewer

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

Renders a monospaced directory tree. Use Unicode box-drawing characters (`├`, `└`, `│`) for alignment.

---

### `file` — Filename pill

```js
{ file: "src/controllers/authController.js" }
```

Inline pill/label showing a file path. Use inline with `p` blocks or above a code block.

---

### `command` — Terminal command

```js
{ command: "npm run dev" }
```

Renders with a `$` prefix in a terminal-styled block with a copy button. Single command per block.

---

## Media & Embeds

### `image` — Full-width image

```js
{ image: "/images/architecture.png", caption: "System architecture overview" }
```

Full-width image. `caption` is optional.

---

### `video` — Embedded video

```js
{ video: "/videos/demo.mp4", caption: "Product walkthrough" }
```

Embeds a video player. `caption` is optional.

---

### `embed` — External embed

```js
{ embed: { type: "youtube", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" } }
{ embed: { type: "loom",    url: "https://www.loom.com/share/abc123" } }
```

Supported `type` values: `"youtube"` | `"loom"`.

---

### `architecture` — System diagram

```js
{ architecture: "/images/system-diagram.png" }
```

Renders the image with an "Architecture" label overlay.

---

## Callouts & Alerts

### `note` — Info callout (blue)

```js
{ note: "MongoDB must be running before starting the server." }
```

---

### `warning` — Warning callout (amber)

```js
{ warning: "Never commit your .env file to version control." }
```

---

### `success` — Success callout (green)

```js
{ success: "Authentication setup complete. All tests pass." }
```

---

### `tip` — Pro-tip callout (purple)

```js
{ tip: "Use Postman to test your API endpoints before connecting the frontend." }
```

---

### `alert` — Canonical alert block

```js
{
  alert: {
    type: "error",
    title: "Breaking Change",
    content: "This endpoint was removed in v2. Use /api/v2/auth instead.",
  }
}
```

Supported `type` values: `"info"` | `"warning"` | `"error"` | `"success"` | `"tip"`.  
`title` is optional. `content` is required.

---

### `callout` — Titled highlight box

```js
{
  callout: {
    title: "Why JWT?",
    content: "JWT allows stateless authentication — no session storage required on the server.",
  }
}
```

General-purpose highlight box with a custom title and body text.

---

## Labels, Links & Metadata

### `badge` — Single pill tag

```js
{ badge: "Beginner" }
```

Single coloured pill. Good for difficulty, status, or category labels.

---

### `tags` — Row of pill tags

```js
{ tags: ["React", "Node.js", "MongoDB", "JWT"] }
```

Renders multiple pills in a horizontal row.

---

### `tech` — Technology stack pills

```js
{ tech: ["React", "Express", "MongoDB", "Tailwind"] }
```

Amber-tinted pills specifically for listing a technology stack.

---

### `link` — Styled external link

```js
{ link: { text: "GitHub Repository", href: "https://github.com/iamshamit" } }
```

Renders as a styled anchor with an `↗` arrow icon.

---

### `author` — Author block

```js
{ author: "Shamit" }
```

Avatar (generated from the initial) with the author name.

---

### `readingTime` — Reading time chip

```js
{ readingTime: "8 min" }
```

Small chip showing estimated reading time. Typically placed near the top of the post body.

---

### `updated` — Last updated chip

```js
{ updated: "Jun 2026" }
```

Small chip showing when the post was last revised.

---

## Rich Blocks

### `table` — Responsive data table

```js
{
  table: {
    headers: ["Package", "Purpose", "Version"],
    rows: [
      ["express", "Backend framework", "4.18"],
      ["mongoose", "MongoDB ODM", "7.0"],
      ["jsonwebtoken", "JWT signing", "9.0"],
    ],
  }
}
```

Scrollable table on mobile. `headers` is a string array; `rows` is an array of string arrays.

---

### `accordion` — Expandable section

```js
{
  accordion: {
    title: "How JWT Works",
    content: "JWT contains a header, payload, and signature. The server signs it; the client sends it back on every request.",
  }
}
```

Collapsed by default; click to expand. Useful for supplementary detail.

---

### `tabs` — Tabbed content switcher

```js
{
  tabs: [
    { label: "JavaScript", content: "const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' });" },
    { label: "TypeScript", content: "const token: string = jwt.sign({ id: user._id }, secret!, { expiresIn: '7d' });" },
  ]
}
```

Each `{ label, content }` pair becomes a tab. `content` is plain text or a code snippet.

---

### `compare` — Before/After comparison

```js
{
  compare: {
    left: "Storing passwords in plain text",
    right: "Hashing with bcrypt (salt rounds: 12)",
  }
}
```

Side-by-side two-column layout with "Before" / "After" (or left/right) framing.

---

### `metric` — Single large statistic

```js
{ metric: { label: "Default token expiry", value: "7 days" } }
```

Oversized value with a smaller label below. Good for key numbers.

---

### `timeline` — Vertical project timeline

```js
{
  timeline: [
    { title: "Project started",      date: "Jan 2026" },
    { title: "Auth system complete", date: "Feb 2026" },
    { title: "Production launch",    date: "Mar 2026" },
  ]
}
```

Vertical list of milestones with a connecting line.

---

### `github` — Static GitHub repo card

```js
{ github: { repo: "iamshamit/portfolio-react" } }
```

Renders a card linking to `https://github.com/<repo>`.

---

### `demo` — Live demo button

```js
{ demo: "https://shamit.is-a.dev" }
```

Prominent button that opens the live demo URL.

---

### `project` — Rich project card

```js
{
  project: {
    title: "Nexara",
    description: "A full-stack freelancing platform with real-time messaging and escrow payments.",
    stack: ["React", "Node.js", "MongoDB", "Socket.io"],
    github: "https://github.com/iamshamit/Freelancer",
    demo: "https://nexara.iamshamit.xyz",
  }
}
```

Full project card with title, description, tech stack pills, and optional GitHub/demo links. `github` and `demo` are optional.

---

## Navigation

### `toc` — Auto table of contents

```js
{ toc: true }
```

Generates a table of contents from all `h`, `h2`, and `h3` blocks in the post. Sticky sidebar on desktop; collapsible disclosure on mobile. Place near the top of `body`.

---

## Complete Example Post

The following is a fully worked post you can copy, paste, and adapt:

```js
{
  num: "05",
  title: "Deploy a Node.js App to a VPS",
  excerpt: "Nginx, PM2, SSL, and a shell script — everything you need to go from localhost to live.",
  date: "Jun 2026",
  read: "12 min",
  tag: "DevOps",
  body: [
    // ── Metadata row ────────────────────────────────────────────
    { toc: true },
    { author: "Shamit" },
    { readingTime: "12 min" },
    { updated: "Jun 2026" },
    { tags: ["Node.js", "Nginx", "PM2", "SSL", "VPS"] },
    { spacer: "sm" },

    // ── Intro ────────────────────────────────────────────────────
    { lead: "A self-managed VPS is the lowest-friction path to a production Node.js server you fully control." },
    { p: "This guide covers provisioning, reverse-proxying with Nginx, keeping the process alive with **PM2**, and wiring up free SSL via Certbot." },

    // ── Prerequisites ────────────────────────────────────────────
    { h: "Prerequisites" },
    {
      prerequisites: [
        "A VPS running Ubuntu 22.04 (DigitalOcean, Hetzner, etc.)",
        "A domain pointed at the server's IP",
        "SSH access as a non-root sudo user",
        "Node.js app ready to deploy",
      ]
    },
    { note: "These instructions assume Ubuntu 22.04. Adapt package manager commands for other distros." },

    // ── What you'll end up with ───────────────────────────────────
    { h: "What You'll Build" },
    {
      outcome: [
        "Node app running as a daemon via PM2",
        "Nginx reverse proxy on port 80/443",
        "Automatic HTTPS via Let's Encrypt",
        "Zero-downtime reload script",
      ]
    },

    // ── Steps ────────────────────────────────────────────────────
    { h: "Step-by-Step" },
    {
      steps: [
        "SSH into the server and update packages",
        "Install Node.js, npm, and PM2",
        "Clone your repo and install dependencies",
        "Configure Nginx as a reverse proxy",
        "Obtain an SSL certificate with Certbot",
        "Start the app with PM2 and save the process list",
      ]
    },

    // ── Install Node ─────────────────────────────────────────────
    { h2: "Install Node.js" },
    { p: "Use the NodeSource setup script to install the LTS release." },
    { command: "curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -" },
    { command: "sudo apt-get install -y nodejs" },
    {
      code: "node -v && npm -v",
      filename: "terminal",
      copyButton: true,
    },

    // ── Environment ───────────────────────────────────────────────
    { h2: "Environment Variables" },
    { warning: "Never commit .env files. Copy them to the server manually or use a secrets manager." },
    {
      code: "PORT=3000\nNODE_ENV=production\nMONGO_URI=mongodb+srv://...\nJWT_SECRET=supersecret",
      filename: ".env",
      collapsed: true,
      collapsible: true,
    },

    // ── PM2 ───────────────────────────────────────────────────────
    { h2: "Start with PM2" },
    { command: "npm install -g pm2" },
    { command: "pm2 start src/index.js --name my-app" },
    { command: "pm2 save && pm2 startup" },
    { success: "The app is now running and will restart automatically after a reboot." },

    // ── Nginx config ──────────────────────────────────────────────
    { h2: "Nginx Reverse Proxy" },
    {
      code: `server {
    listen 80;
    server_name example.com www.example.com;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`,
      filename: "nginx.conf",
      lineNumbers: true,
      copyButton: true,
    },
    { command: "sudo nginx -t && sudo systemctl reload nginx" },

    // ── SSL ───────────────────────────────────────────────────────
    { h2: "Free SSL with Certbot" },
    { command: "sudo apt install certbot python3-certbot-nginx -y" },
    { command: "sudo certbot --nginx -d example.com -d www.example.com" },
    { tip: "Certbot auto-renews certificates. Confirm with: sudo certbot renew --dry-run" },

    // ── Project file structure ────────────────────────────────────
    { h: "Final File Layout" },
    {
      tree: `my-app/
├── src/
│   ├── index.js
│   ├── routes/
│   └── controllers/
├── .env
├── package.json
└── ecosystem.config.js`
    },

    // ── Key packages ──────────────────────────────────────────────
    { h: "Key Packages" },
    {
      table: {
        headers: ["Tool", "Role", "Install"],
        rows: [
          ["PM2", "Process manager", "npm i -g pm2"],
          ["Nginx", "Reverse proxy + TLS termination", "apt install nginx"],
          ["Certbot", "Let's Encrypt SSL certificates", "apt install certbot"],
        ],
      }
    },

    // ── FAQ ───────────────────────────────────────────────────────
    { h: "FAQ" },
    {
      accordion: {
        title: "How do I deploy an update?",
        content: "Pull the latest code, run npm install if dependencies changed, then: pm2 reload my-app",
      }
    },
    {
      accordion: {
        title: "Which port should my Node app listen on?",
        content: "Any unprivileged port works (3000–8999). Nginx forwards public traffic from 80/443 to that port.",
      }
    },

    // ── Metrics ───────────────────────────────────────────────────
    { h: "By the Numbers" },
    { metric: { label: "Time to deploy (first run)", value: "~20 min" } },
    { metric: { label: "Monthly cost (Hetzner CX11)", value: "$4" } },

    // ── See it live ───────────────────────────────────────────────
    { h: "Resources" },
    { link: { text: "PM2 documentation", href: "https://pm2.keymetrics.io/docs/usage/quick-start/" } },
    { link: { text: "Nginx Beginner's Guide", href: "https://nginx.org/en/docs/beginners_guide.html" } },
    { github: { repo: "iamshamit/portfolio-react" } },
    { demo: "https://shamit.is-a.dev" },

    // ── Wrap up ───────────────────────────────────────────────────
    { spacer: "md" },
    { divider: true },
    { quote: "The server that runs is better than the config that's perfect.", cite: "Production wisdom" },
    { p: "You now have a hardened, HTTPS-enabled Node.js app running on a VPS you control end to end." },
  ],
}
```
