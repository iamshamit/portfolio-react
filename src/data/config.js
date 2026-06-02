export const PORTFOLIO = {
  name: "Shamit",
  fullName: "Shamit Mishra",
  role: "Software Engineer",
  location: "India · Remote",
  eyebrow: "COMPUTER SCIENTIST · SOFTWARE ENGINEER · BUILDER",

  hero: {
    line1: "Shamit",
    line2: "Mishra.",
    sub: "I design and build modern web applications, resilient backend systems, and AI-powered products — engineering experiences that connect, compute, and inspire.",
  },

  about: {
    lede: "I'm a computer science graduate and software engineer who treats the browser as a canvas and the server as a craft.",
    body: [
      "From pixel-precise interfaces to distributed systems that stay calm under load, I build across the whole stack — and lately, the intelligence layer that sits on top of it.",
      "Curious by default and collaborative by nature, I care about the seams: the moment data becomes interface, the millisecond a request resolves, the feeling a product leaves behind.",
    ],
    stats: [
      { n: "20+", l: "Projects shipped" },
      { n: "6+", l: "Core languages" },
      { n: "∞", l: "Commits & counting" },
    ],
  },

  featured: [
    {
      num: "01",
      name: "Nexara",
      tagline: "Freelancing reimagined.",
      desc: "A full-stack freelancing platform connecting employers with skilled freelancers. Features include job posting, real-time messaging, secure escrow-based payments, reviews & ratings, and role-based workflows for employers and freelancers.",
      role: "Full-stack · MERN",
      year: "2026",
      stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "JWT Auth"],
      gradient: "ocean",
      mock: "browser",
      url: "https://nexara.iamshamit.xyz/",
      repo: "https://github.com/iamshamit/Freelancer",
    },
    {
      num: "02",
      name: "SpendWise",
      tagline: "Track spending, master finances.",
      desc: "A personal finance and expense tracking web application that helps monitor income, expenses, and spending patterns. Features category-wise tracking, visual summaries, and a clean responsive UI.",
      role: "Full-stack · Finance",
      year: "2026",
      stack: ["React", "Vite", "React Router", "Context API", "Tailwind", "Node.js", "MongoDB"],
      gradient: "teal",
      mock: "browser",
      url: "https://spendwise.iamshamit.xyz/",
      repo: "https://github.com/iamshamit/spendwise",
    },
    {
      num: "03",
      name: "portfolio-react",
      tagline: "Identity, distilled.",
      desc: "A personal portfolio website showcasing skills, experience, and projects. Built with React and featuring a responsive design, contact form, and modern animations for a seamless browsing experience.",
      role: "Frontend · Design",
      year: "2026",
      stack: ["React", "Vite", "Tailwind CSS", "CSS", "Framer Motion"],
      gradient: "aurora",
      mock: "browser",
      url: "https://shamit.is-a.dev",
      repo: "https://github.com/iamshamit/portfolio-react",
    },
  ],

  gallery: [
    { num: "04", name: "BlogHub", tag: "Blog Platform", stack: "React · Node.js · MongoDB", gradient: "ocean", url: "#" },
    { num: "05", name: "TaskFlow", tag: "Project Management", stack: "React · Express · PostgreSQL", gradient: "teal", url: "#" },
    { num: "06", name: "ChatApp", tag: "Real-time Messaging", stack: "Socket.io · Node.js · React", gradient: "aurora", url: "#" },
    { num: "07", name: "WeatherHub", tag: "Weather Dashboard", stack: "React · API Integration", gradient: "ember", url: "#" },
  ],

  skills: [
    { group: "Languages", items: ["TypeScript", "Python", "Go", "JavaScript", "Java", "SQL"] },
    { group: "Frontend", items: ["React", "Next.js", "GSAP", "Three.js", "Tailwind", "WebGL"] },
    { group: "Backend", items: ["Node.js", "FastAPI", "gRPC", "GraphQL", "PostgreSQL", "Redis"] },
    { group: "AI / ML", items: ["OpenAI", "LangChain", "pgvector", "PyTorch", "RAG"] },
    { group: "Infra", items: ["Docker", "Kubernetes", "AWS", "CI / CD", "Terraform"] },
  ],

  timeline: [
    { when: "2024 — Now", what: "Software Engineer", where: "Stealth Startup", note: "Building AI-powered web products end to end — frontend, backend, and the model glue between." },
    { when: "2023", what: "Software Engineering Intern", where: "TechCorp", note: "Shipped internal tooling and API services used across three product teams." },
    { when: "2020 — 2024", what: "B.S. Computer Science", where: "State University", note: "Focus on distributed systems, machine learning, and human–computer interaction." },
  ],

  github: {
    handle: "@iamshamit",
    blurb: "Most of my work is open. Components, experiments, and the occasional weekend rabbit hole.",
    stats: [
      { n: "120+", l: "Repositories" },
      { n: "1.4k", l: "Contributions / yr" },
      { n: "30+", l: "Stars earned" },
    ],
  },

  contact: {
    email: "shamitmishra22@gmail.com",
    socials: [
      { label: "GitHub", href: "https://github.com/iamshamit" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Resume", href: "#" },
      { label: "Email", href: "mailto:shamitmishra22@gmail.com" },
    ],
  },

  journal: [
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
    {
      num: "01",
      title: "MERN Authentication From Scratch",
      excerpt:
        "Build a complete MERN application with JWT authentication, protected routes, MongoDB integration, and frontend API communication.",
      date: "Jan 2026",
      read: "20 min",
      tag: "Tutorial",
      body: [
        {
          p: "In this guide we'll build a complete authentication system using MongoDB, Express, React, and Node.js. By the end you'll have registration, login, protected routes, JWT authentication, password hashing, and frontend API integration."
        },
    
        {
          h: "Prerequisites"
        },
    
        {
          list: [
            "Node.js installed",
            "MongoDB installed locally or Atlas account",
            "Basic knowledge of React and JavaScript",
            "VS Code or another editor"
          ]
        },
    
        {
          h: "Project Structure"
        },
    
        {
          code: `project/
    ├── frontend
    └── backend`
        },
    
        {
          h: "Frontend Setup"
        },
    
        {
          p: "Create a React project using Vite."
        },
    
        {
          code: `npm create vite@latest frontend -- --template react`
        },
    
        {
          p: "Install required dependencies."
        },
    
        {
          code: `cd frontend
          npm install react-router-dom axios`
        },
    
        {
          h: "Create Pages"
        },
    
        {
          code: `src/
    ├── pages/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx
    │   └── NotFound.jsx`
        },
    
        {
          p: "These pages will handle authentication and protected content."
        },
    
        {
          h: "Configure Routing"
        },
    
        {
          code: `// full App.jsx code`
        },
    
        {
          p: "The application now supports login, register, dashboard, and fallback routes."
        },
    
        {
          h: "Backend Setup"
        },
    
        {
          code: `mkdir backend
    cd backend
    npm init -y`
        },
    
        {
          code: `npm install express mongoose bcrypt jsonwebtoken cors dotenv
          npm install nodemon --save-dev`
        },
    
        {
          h: "Backend Structure"
        },
    
        {
          code: `backend/
    ├── server.js
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    └── routes/`
        },
    
        {
          h: "Create Database Connection"
        },
    
        {
          p: "Inside config/db.js create a reusable MongoDB connection."
        },
    
        {
          code: `// complete db.js code`
        },
    
        {
          h: "Environment Variables"
        },
    
        {
          code: `PORT=5000
    MONGO_URI=...
    JWT_SECRET=...`
        },
    
        {
          quote:
            "Never commit your .env file to GitHub.",
          cite: "Security Best Practice"
        },
    
        {
          h: "Create User Model"
        },
    
        {
          code: `// complete User model`
        },
    
        {
          p: "The model stores user information and timestamps."
        },
    
        {
          h: "Authentication Controller"
        },
    
        {
          p: "The controller handles registration, login, and user retrieval."
        },
    
        {
          code: `// registerUser implementation`
        },
    
        {
          code: `// loginUser implementation`
        },
    
        {
          code: `// getUserData implementation`
        },
    
        {
          h: "How Registration Works"
        },
    
        {
          list: [
            "Validate request body",
            "Check if user already exists",
            "Hash password using bcrypt",
            "Create user",
            "Generate JWT token",
            "Return user data"
          ]
        },
    
        {
          h: "How Login Works"
        },
    
        {
          list: [
            "Validate credentials",
            "Find user",
            "Compare passwords",
            "Generate token",
            "Return authenticated user"
          ]
        },
    
        {
          h: "JWT Middleware"
        },
    
        {
          code: `// complete authMiddleware.js`
        },
    
        {
          p: "This middleware protects private routes by verifying JWT tokens."
        },
    
        {
          h: "Authentication Routes"
        },
    
        {
          code: `// complete routes/auth.js`
        },
    
        {
          h: "Frontend API Layer"
        },
    
        {
          code: `// complete api.js`
        },
    
        {
          p: "Axios interceptors automatically attach JWT tokens to requests."
        },
    
        {
          h: "Login Page"
        },
    
        {
          code: `// complete Login.jsx`
        },
    
        {
          h: "Register Page"
        },
    
        {
          code: `// complete Register.jsx`
        },
    
        {
          h: "Dashboard Page"
        },
    
        {
          code: `// complete Dashboard.jsx`
        },
    
        {
          h: "Testing The Flow"
        },
    
        {
          list: [
            "Start MongoDB",
            "Run backend server",
            "Run frontend server",
            "Register a user",
            "Login",
            "Access dashboard",
            "Verify protected route"
          ]
        },
    
        {
          h: "Common Errors"
        },
    
        {
          list: [
            "MongoDB connection failed",
            "JWT secret missing",
            "CORS errors",
            "Token not sent in headers",
            "Invalid password hash"
          ]
        },
    
        {
          h: "Next Improvements"
        },
    
        {
          list: [
            "Refresh tokens",
            "Email verification",
            "Forgot password",
            "Role based access",
            "Rate limiting"
          ]
        },
    
        {
          h: "Conclusion"
        },
    
        {
          p: "You now have a complete authentication system with React, Express, MongoDB, bcrypt, JWT, protected routes, and persistent login."
        }
      ]
    },
    {
      num: "02",
      title: "Backpressure is a feature, not a failure",
      excerpt: "Notes from building Helix — what a million jobs a day taught me about saying no, gracefully.",
      date: "Apr 2026",
      read: "8 min",
      tag: "Systems",
      body: [
        { p: "The first version of any queue works beautifully — until the producers outrun the consumers. Then it doesn't degrade, it *collapses*. The fix isn't more workers. It's teaching the system to push back." },
        { h: "Saying no, on purpose" },
        { p: "Backpressure is the discipline of refusing work you can't honor yet. A bounded buffer, a rejection path, a retry budget. It feels like a limitation; it's actually what keeps the system honest under load." },
        { code: "if (queue.depth > highWaterMark) {\n  return reject(BUSY); // breathe\n}" },
        { p: "Exactly-once delivery, calm p99s, and predictable recovery all fall out of this one decision: bound everything, and make the bound visible." },
        { quote: "A system that can't say no will eventually say nothing.", cite: "— Helix postmortem" },
        { p: "Observability closes the loop. If you can see the buffer fill, you can reason about the failure before it happens — which is the whole game." },
      ],
    },
    {
      num: "03",
      title: "Designing with models, not around them",
      excerpt: "AI features fail when they're bolted on. They land when the model is a first-class material in the design.",
      date: "Mar 2026",
      read: "5 min",
      tag: "AI",
      body: [
        { p: "Most AI features feel grafted on because they are — a chat box in the corner, a magic button that sometimes lies. The interesting work starts when you treat the model as a **material**: something with grain, tolerances, and failure modes you design *with*." },
        { h: "Ground everything" },
        { p: "Retrieval isn't a performance trick, it's a trust mechanism. When every answer carries its citations, the user can verify instead of believe. That single move turns a party trick into a tool." },
        { list: [
          "Show the sources, always",
          "Make confidence legible, not hidden",
          "Design the empty and wrong states first",
        ]},
        { p: "The model is probabilistic; the interface around it should be deterministic. That contrast — soft core, hard shell — is where good AI products live." },
      ],
    },
    {
      num: "04",
      title: "On finishing things",
      excerpt: "A short one. The unglamorous discipline that separates a portfolio from a graveyard of 80%-done repos.",
      date: "Feb 2026",
      read: "3 min",
      tag: "Craft",
      body: [
        { p: "The last 20% of any project is where the craft lives, and it's exactly the part that's no fun. The novelty is gone, the hard problems are solved, and what's left is polish, edge cases, and the quiet work of making it real." },
        { quote: "Shipping is a skill you practice, not a moment you reach.", cite: "" },
        { p: "I've learned to treat finishing as its own discipline — scheduled, deliberate, protected from the urge to start the next shiny thing. A shipped 90% beats a perfect idea every time." },
      ],
    },
  ],
};
