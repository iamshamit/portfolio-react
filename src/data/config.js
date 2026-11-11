export const PORTFOLIO = {
  name: "Shamit",
  fullName: "Shamit Mishra",
  role: "Software Engineer · Full-Stack",
  location: "India · Remote",
  eyebrow: "FULL-STACK ENGINEER · INDIA · OPEN TO WORK",

  hero: {
    line1: "Shamit",
    line2: "Mishra.",
    sub: "I build backend systems and the interfaces on top of them. Lately: the API behind a live GPS tracking platform, and a review system that keeps startup selection fair.",
  },

  about: {
    lede: "I'm a computer science graduate and software engineer who treats the browser as a canvas and the server as a craft.",
    body: [
      "From pixel-precise interfaces to distributed systems that stay calm under load, I build across the whole stack and lately, the intelligence layer that sits on top of it.",
      "Curious by default and collaborative by nature, I care about the seams: the moment data becomes interface, the millisecond a request resolves, the feeling a product leaves behind.",
    ],
  },

  featured: [
    {
      num: "01",
      name: "Avni",
      tagline: "Every role. One workspace.",
      desc: "A workspace platform where incubators, accelerators and investors run programs and startups apply. I built its review system: applications are dealt to reviewers, scored blind, and corrected for strict and generous scorers.",
      role: "Full-stack · Team",
      year: "2026",
      stack: ["React 19", "Vite", "TypeScript", "Tailwind CSS", "Three.js", "Framer Motion", "Express", "MongoDB", "JWT Auth"],
      gradient: "ocean",
      mock: "browser",
      screenshot: "/screenshots/avni.png",
      url: "https://avni.app",
      repo: "#",
      // Case study, written from the AVNI repo (backend/src/services/review*.ts, middleware/orgRoles.ts, config/orgTypes.ts).
      study: {
        excerpt: "A review system that deals applications to reviewers, corrects for strict and generous scorers, and locks itself when the work is done.",
        read: "4 min",
        body: [
          { h: "Context" },
          { p: "Avni is a workspace platform for the people around a startup. Incubators, accelerators, investors and corporates run programs on it; startups apply; mentors and individuals have workspaces of their own. I am one of a small team on it, working across an Express and MongoDB backend and a React frontend. My largest piece of work is the review system, the part that decides which applications move forward." },

          { h: "The problem" },
          { p: "A program gets more applications than one person can read, so the work is shared between reviewers. That creates a fairness problem. One reviewer gives everything a 3, another hands out 5s, and each application is only read by a few of them. With a plain average, a startup's result depends on who it happened to be dealt to." },

          { h: "Dealing the work" },
          { p: "Handing out applications is a set of pure functions with no database in them, so they can be checked on their own." },
          { list: [
            "A round is split between reviewer groups either by share or by an answer on the application form. Leftovers are divided with the largest-remainder method, so the counts always add up.",
            "Inside a group, each application goes to the least-loaded reviewers first.",
            "The shuffle is seeded, so the same round always produces the same split. An organiser can re-run it and get the same answer.",
            "A reviewer who declares a conflict of interest is replaced by the next least-loaded reviewer who is not already on that application.",
          ] },

          { h: "Correcting for strict and generous reviewers" },
          { p: "Every reviewer in a round also scores a small shared calibration set. It is picked evenly across the range of form scores, so everyone sees weak, middling and strong applications." },
          { p: "From there I model each reviewer as: score = mean + spread x (true score - mean) + offset. Offset says how strict or generous the reviewer is. Spread says whether they use the whole scale or bunch everything in the middle. The fit alternates between estimating each application's true score and each reviewer's offset and spread, for 25 passes." },
          { list: [
            "A reviewer with fewer than five reviews is left uncorrected. There is not enough evidence to adjust them.",
            "Estimates are pulled toward 'no correction' when a reviewer has few reviews, so a small sample cannot produce a large adjustment.",
            "Offsets are pinned to average zero across the panel, so strict and generous are measured against the panel and not against a drifting consensus.",
            "Before merging rankings from different groups, a union-find check confirms the groups are linked by applications that both reviewed. If they are not, the organiser is told the groups cannot be compared.",
          ] },

          { h: "Blind until submitted, locked when complete" },
          { p: "Reviewers score weighted 1 to 5 criteria and cannot see anyone else's scores until they submit their own. That includes organisers who are also reviewing. Once nobody assigned to an application still has a review to submit, its reviews lock. Criteria freeze as soon as the first review exists, so the scale cannot change under reviewers." },

          { h: "Two layers of permission" },
          { p: "Access is checked twice on the server. The first check is membership: is this user the owner, an admin or a moderator of the workspace? The second is workspace type: only incubator, accelerator, investor and corporate workspaces can run programs at all. The frontend hides what a user cannot use, but the backend enforces both checks independently, so a hidden button is never the only protection." },

          { h: "Rules that can be checked" },
          { p: "Scoring, dealing and calibration are pure functions, and each has a small assert-based check script that runs with one command. The code where a mistake would change who gets selected is the code that is easiest to verify." },

          { tech: ["React 19", "Vite", "TypeScript", "TanStack Query", "Express 5", "MongoDB", "Mongoose", "JWT"] },
          { link: { text: "Visit Avni", href: "https://avni.app" } },
        ],
      },
    },
    {
      num: "02",
      name: "Nexara",
      tagline: "Freelancing reimagined.",
      desc: "A freelance marketplace that grew out of a hackathon. Jobs are split into milestones held in escrow, employers and freelancers talk over live chat, and accounts can turn on two-factor sign-in.",
      role: "Full-stack · MERN",
      year: "2026",
      stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "JWT Auth"],
      gradient: "teal",
      mock: "browser",
      mockUrl: "nexara.iamshamit.app",
      screenshot: "/screenshots/nexara.png",
      url: "https://nexara.iamshamit.com/",
      repo: "https://github.com/iamshamit/Freelancer",
      // Case study, written from the Freelance repo (backend/models/Escrow.js, controllers/milestoneController.js, server.js).
      study: {
        excerpt: "A freelance marketplace that began at a hackathon: milestone escrow, live chat and two-factor sign-in.",
        read: "3 min",
        body: [
          { h: "Where it started" },
          { p: "I led a team at Smart India Hackathon 2024, where we built a freelance marketplace and presented it to industry and government evaluators. Afterwards I built the idea out on my own as Nexara: a React frontend, an Express API and MongoDB." },

          { h: "Escrow by milestone" },
          { p: "The core question in freelancing is trust: the freelancer wants to know the money exists, and the employer wants to pay only for finished work. Nexara answers it with an escrow record per job." },
          { list: [
            "When a job is assigned, its budget is held in an escrow record.",
            "The employer splits the job into milestones. Their percentages must add up to exactly 100, or the request is rejected.",
            "The freelancer marks a milestone complete. The employer approves it.",
            "Approval releases that milestone's share, writes a transaction from the escrow to the freelancer, and starts the next milestone.",
            "When the approved milestones reach 100 percent, the job closes and a PDF receipt can be downloaded.",
          ] },
          { p: "The escrow is a ledger inside the app: at every step it records what is held, what has been released, and to whom." },

          { h: "Real-time chat" },
          { p: "Chat runs on Socket.io. Each conversation and each user has a room, so a message reaches the open chat window and the recipient's notification badge at the same moment. The server tracks who is online, shows typing indicators and read receipts, and sends a heartbeat to each connection so a dropped client is noticed instead of staying 'online' forever." },

          { h: "Accounts" },
          { p: "There are three roles: freelancer, employer and admin. Passwords are hashed with bcrypt, sessions use JWT, and accounts can turn on two-factor authentication with an authenticator app and one-time backup codes." },

          { tech: ["React", "Vite", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Socket.io", "JWT Auth"] },
          { link: { text: "Visit Nexara", href: "https://nexara.iamshamit.com/" } },
          { spacer: "sm" },
          { link: { text: "Source on GitHub", href: "https://github.com/iamshamit/Freelancer" } },
        ],
      },
    },
    {
      num: "03",
      name: "Rahi",
      tagline: "Fleet tracking, real-time.",
      desc: "A live platform where organizations manage GPS and IoT trackers in real time. I built the API behind it: authentication, team roles, subscription plans paid through Razorpay, and Google sign-in.",
      role: "Full-stack · Team",
      year: "2026",
      stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Google OAuth", "Razorpay"],
      gradient: "aurora",
      mock: "browser",
      mockUrl: "rahi.r2e.in",
      screenshot: "/screenshots/rahi.png",
      url: "https://rahi.r2e.in",
      repo: "#",
      // Case study, written from the rahi-dashboard repo (backend/middleware/subscriptionLimits.js, routes/razorpay.js, routes/auth.js).
      // Rahi is R2E's product: check with them before publishing anything more detailed than this.
      study: {
        excerpt: "Moving a live tracking dashboard off the browser and onto a real API.",
        read: "3 min",
        body: [
          { h: "Context" },
          { p: "Rahi is R2E Technologies' platform for managing GPS and IoT trackers. Individuals and organizations see their devices in one place, in real time. It is in production. I started on the dashboard's frontend, building the map layer and the admin monitoring views, and then moved to the backend: first as an intern, and now as a Software Engineer." },

          { h: "The move" },
          { p: "The first version of the dashboard talked to its database straight from the browser. That is quick to start with, but every rule about who can see what has to live in client code. I built the first version of the backend, an Express API on MongoDB, and moved the frontend onto it. Since then the browser never touches the database: every request goes through an authenticated endpoint, and the rules live on the server." },

          { h: "Plans enforced in one place" },
          { p: "Rahi is sold by subscription, and each plan has limits: devices, team members, API calls, storage. I did not want limit checks scattered across handlers, so the check is a single middleware that takes the name of the feature. A route that adds a device declares the device limit and nothing else." },
          { list: [
            "When a limit is reached the API answers with a specific error code plus the current usage and the limit, so the dashboard can show an upgrade prompt instead of a generic failure.",
            "Accounts without a subscription fall back to the free plan's limits.",
            "If the limit check itself fails, the request is allowed through and the error is logged. A billing bug should not lock a paying customer out of their own trackers.",
          ] },

          { h: "Payments and sign-in" },
          { p: "Subscriptions are paid through Razorpay. The server never trusts the browser's word that a payment succeeded: it recomputes the HMAC signature for each payment and for each webhook before changing a subscription. Sign-in supports email and Google, and the Google token is verified on the server before an account is created or matched." },

          { h: "Teams and roles" },
          { p: "An organization can invite people and give them a role: admin, manager, member or viewer. Roles decide who can manage devices and who can only watch them, which is what lets a company share its trackers without sharing its account. Teams also get group and direct chat over Socket.io, and a signed-in device can stream its own location to the map." },

          { tech: ["Node.js", "Express", "MongoDB", "Socket.io", "Razorpay", "Google OAuth", "React"] },
          { link: { text: "Visit Rahi", href: "https://rahi.r2e.in" } },
        ],
      },
    },
  ],

  gallery: [
    { num: "04", name: "Portfolio", tag: "Personal Portfolio", desc: "His previous portfolio site, before this one.", stack: "React · Vite · Framer Motion", gradient: "aurora", url: "https://shamit.is-a.dev", screenshot: "/screenshots/portfolio.png" },
    { num: "05", name: "SpendWise", tag: "Finance Tracker", desc: "A personal finance tracker: income, expenses and budgets, with sign-in, categorised transactions and analytics.", stack: "React · Node.js · MongoDB", gradient: "teal", url: "https://spendwise.iamshamit.com", screenshot: "/screenshots/spendwise.png" },
    { num: "06", name: "FMHY Search", tag: "Flow Launcher Plugin", desc: "Searches the FMHY index straight from Flow Launcher on Windows. Published on the Flow Launcher plugin store; its GitHub repo has 15+ stars.", stack: "Python", gradient: "ocean", url: "https://www.flowlauncher.com/plugins/fmhy-search-3f7a2b1c-9e4d-4f8a-b3c2-1a5d8e7f0b9c/", screenshot: "/screenshots/fmhy-search.png" },
    { num: "07", name: "Pasta", tag: "Text Sharing", desc: "A pastebin-style app for sharing text and code snippets by link.", stack: "React · Node.js · MongoDB", gradient: "ember", url: "https://pasta.iamshamit.com", screenshot: "/screenshots/pasta.png" },
  ],

  skills: [
    { group: "Languages", items: ["TypeScript", "Python", "Go", "JavaScript", "Java", "SQL"] },
    { group: "Frontend", items: ["React", "Next.js", "GSAP", "Three.js", "Tailwind"] },
    { group: "Backend", items: ["Node.js", "Express", "Hono.js", "MongoDB", "Redis"] },
    { group: "Infra", items: ["Docker", "AWS", "CI / CD"] },
  ],

  timeline: [
    { when: "Sep 2026 – Present", what: "Software Engineer", where: "R2E Technologies Pvt. Ltd.", note: "Full-stack on AVNI, a workspace platform for India's startup ecosystem, and on RAHI, an IoT tracking and fleet management dashboard." },
    { when: "Jul 2025 – Sep 2026", what: "Software Engineer Intern", where: "R2E Technologies Pvt. Ltd.", note: "REST APIs, the React dashboard, Google sign-in and Razorpay subscriptions for RAHI." },
    { when: "2022 – 2026", what: "B.Tech Computer Science & Engineering", where: "GIET University, Gunupur, Odisha", note: "Computer Science & Engineering with focus on full-stack development, distributed systems, and software engineering fundamentals." },
  ],

  github: {
    handle: "@iamshamit",
    blurb: "Most of my work is open. Components, experiments, and the occasional weekend rabbit hole.",
    stats: [
      // fallbacks; GitHub() swaps in live numbers on load
      { key: "repos", n: "17", l: "Public repos" },
      { key: "contrib", n: "2,198", l: "Contributions / yr" },
      { key: "stars", n: "22", l: "Stars earned" },
    ],
  },

  contact: {
    email: "shamitmishra.work@gmail.com",
    socials: [
      { label: "GitHub", href: "https://github.com/iamshamit" },
      { label: "LinkedIn", href: "https://linkedin.com/in/iamshamit" },
    ],
  },

  // Extra facts for the terminal's AI (worker/ask.js). Not shown anywhere on the site.
  ai: {
    proudest: "Avni is his proudest project: a multi-role workspace platform for founders, startups, accelerators, incubators, mentors, investors and enterprises, built with React, TypeScript, Express and MongoDB. His biggest piece of it is the review system: applications are dealt to reviewers, scored blind on weighted criteria, and corrected for strict and generous reviewers before they are ranked. He also built its role-based access, which checks workspace membership and organization type separately on the server.",
    // work + more: updated from his LinkedIn profile (Nov 2026)
    work: [
      "Current job: Software Engineer (full-time) at R2E Technologies Private Limited since Sep 2026 (hybrid). Before that he was a Software Engineer Intern there from Jul 2025 to Sep 2026.",
      "As a Software Engineer he works full-stack on AVNI (avni.app), a workspace platform for India's startup ecosystem: startups, incubators, accelerators, mentors, investors and enterprises each get their own workspace under one account. He builds it with two teammates.",
      "On AVNI he works on the Express + TypeScript API on MongoDB (JWT login, email-verified sign-up), role-based access with separate checks for workspace membership and organization type, and the React + Vite frontend with TanStack Query and Tailwind CSS.",
      "AVNI features he has built end to end: program applications and the review system, startup onboarding, agreement e-signing, workspace billing with Razorpay, visit analytics and a public repository of government schemes. He also handles database design and performance, such as the indexes that keep deep pagination fast on large public directories, and fixed the findings from a security audit of the platform.",
      "He still works on RAHI (rahi.r2e.in), R2E's real-time IoT tracking and fleet management dashboard, on both the frontend and the APIs.",
      "As an intern he worked on RAHI: REST APIs in Node.js and Express for devices, users and teams; the React and Tailwind dashboard where organizations manage users and devices with live map tracking; login and role-based access including Google sign-in; and subscriptions and payments with Razorpay.",
    ],
    lookingFor: "Full-stack or backend roles, ideally on AI-powered products. Open to remote work or on-site roles anywhere, happy to relocate. Available to start immediately.",
    // this website, for questions like "how was this site built?"
    site: [
      "This website is iamshamit.com (also shamit.is-a.dev). Shamit designed and built it himself.",
      "Frontend: React and Vite, GSAP (ScrollTrigger, SplitText) for the motion, Lenis for smooth scrolling, and a hand-written WebGL shader (no 3D library) for the liquid backdrop and the glass sphere. The terminal is xterm.js.",
      "Backend: a Cloudflare Worker with a D1 (SQLite) database, a Durable Object that keeps a live WebSocket count of visitors, and Workers AI running Llama 3.1 8B for this assistant. It also talks to the GitHub and Spotify APIs, and sends terminal messages to Shamit through Discord.",
      "The glass sphere is the thread through the whole site: it is born in the opening intro and swallows the screen, then follows you down the page, docks beside each section heading, takes on each project's colour, rides the experience timeline, opens the menu by swelling to fill the screen, becomes a lens that follows your cursor in the contact section, and drifts alone on the 404 page.",
      "Live details: the hero shows Shamit's local time in India and what he is up to right now (the song he is playing on Spotify, his latest GitHub push, or a short status note he sets). The top bar shows how many people are on the site. Journal articles count views and have a spark button. The GitHub section shows his real contribution graph.",
      "Sections, top to bottom: hero, about, selected work (Avni, Nexara, Rahi, each with a case study), more projects, toolkit, experience and education, open source (GitHub), journal, contact.",
      "Case studies open at iamshamit.com/work/avni, /work/nexara and /work/rahi, or with the terminal command case <project>.",
      "The terminal opens with the ` or ~ key, or the Ask me link in the top bar. Commands: ask (or any question ending in ?), whoami, about, neofetch, ls, case <project>, open <project>, skills, gh (repos, langs, activity), message <text> (goes straight to Shamit), sign and guestbook, who, np (now playing), contact, socials, theme <name> (ocean, silk, teal, aurora, ember), time, clear, exit. Tab completes, and grey suggestions appear as you type.",
      "Privacy: visitors' IP addresses are hashed, never stored raw, and analytics are only simple counters. Questions asked to this assistant are kept for 30 days so Shamit can see what people want to know.",
      "Small touches: the tab title says come back when you switch away, the footer name letters move away from your cursor, and sudo hire shamit in the terminal drafts an email to him.",
    ],
    learning: "Going deeper into Go and edge/serverless backends (Cloudflare Workers, Hono), and building LLM features into real products, such as this very assistant on his portfolio.",
    workStyle: "He likes owning features end to end, from the database schema to the last pixel, and cares about the details users feel, like speed and polish.",
    more: [
      "Based in Hyderabad, Telangana. Hometown: Odisha.",
      "Education: B.Tech in Computer Science & Engineering from GIET University, Gunupur, Odisha (2022 to 2026). Higher secondary (Science, CBSE) at Bhubaneswar Model Public School (2020 to 2022). Schooling (ICSE) at Little Flower School, Odisha, until 2020.",
      "Certification: DSA with Java, from Apna College.",
      "He enjoys every part of building his projects, from the first idea and the database design to the interface, the motion and the last bug fix. No single area is his favourite: he likes owning the whole thing.",
      "Other projects: a Personal Finance Tracker (MERN, Jan to Mar 2024, the project that became SpendWise) with authentication, categorised transactions, analytics and budgets.",
      "Led a team at Smart India Hackathon 2024 that built a freelance marketplace (which became Nexara) and presented it to industry and government evaluators.",
      "Built a water-issue crowdsourcing Android app at the Water Tech Hackathon (Feb 2024), with real-time issue tracking, location-based reporting, sign-in and push notifications.",
      "2,000+ GitHub contributions in the past year.",
      "Real users: the FMHY Search plugin is published on the Flow Launcher plugin store and its GitHub repo (fmhy-search-flow-launcher) has 15+ stars. It is his project with public, confirmed users. Rahi is a live production platform at R2E Technologies.",
      "Hackathons: he took part in and led teams at hackathons (details above); no wins or prizes are listed.",
      "Other open-source work: instadown (Kotlin Android app that downloads Instagram photos and carousels), disbot (Python Discord bot), goapi (Go REST API), and this portfolio (React, WebGL, Cloudflare Workers).",
    ],
  },

  journal: [
    {
      num: "01",
      title: "MERN Authentication From Scratch",
      excerpt:
        "Build a complete MERN application with JWT authentication, protected routes, MongoDB integration, and frontend API communication.",
      date: "Jan 2026",
      read: "15 min",
      tag: "Tutorial",
      body: [
        { toc: true },
        { readingTime: "15 min" },
        { updated: "Jan 2026" },
        { tags: ["React", "Node.js", "MongoDB", "Express", "Full-Stack"] },
        { spacer: "sm" },

        { lead: "Build a complete MERN application with JWT authentication, protected routes, and MongoDB integration  from an empty folder to a working login system." },
        { p: "Breaking this into nine parts makes the process approachable. You'll end up with a React frontend, an Express backend, and a full auth flow you can ship and build on." },
        { outcome: [
          "React frontend with Vite and Tailwind CSS",
          "Express.js backend with MongoDB",
          "Register, Login, and Protected Routes",
          "JWT authentication with Axios interceptors",
        ]},

        { h: "Frontend Setup with Vite" },
        { p: "Create and bootstrap the React project." },
        { command: "npm create vite@latest frontend -- --template react" },
        { p: "Install routing and HTTP client." },
        { command: "cd frontend && npm install react-router-dom axios" },

        { h2: "Create Pages" },
        { tree: `src/\n├── pages/\n│   ├── Login.jsx\n│   ├── Register.jsx\n│   ├── Dashboard.jsx\n│   └── NotFound.jsx` },

        { h2: "Configure Routing" },
        { code: `import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`, filename: "App.jsx", copyButton: true },

        { h: "Styling with Tailwind CSS" },
        { command: "npm install tailwindcss @tailwindcss/vite" },
        { code: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})`, filename: "vite.config.js", copyButton: true },
        { code: `@import "tailwindcss";`, filename: "index.css" },

        { h: "Backend Setup with Express" },
        { tree: `backend/\n├── server.js\n├── .env\n├── config/\n│   └── db.js\n├── models/\n│   └── User.js\n├── routes/\n│   └── auth.js\n├── controllers/\n│   └── authController.js\n└── middleware/\n    └── authMiddleware.js` },
        { command: "cd backend && npm init -y" },
        { code: `npm install express mongoose bcrypt jsonwebtoken cors dotenv\nnpm install nodemon --save-dev`, filename: "terminal", copyButton: true },
        { p: "Package breakdown: **express** (web framework), **mongoose** (MongoDB ODM), **bcrypt** (password hashing), **jsonwebtoken** (JWT), **cors** (cross-origin), **dotenv** (env vars)." },
        { code: `{\n  "scripts": {\n    "start": "node server.js",\n    "dev": "nodemon server.js"\n  }\n}`, filename: "package.json" },

        { h: "Backend Core Files" },
        { file: "server.js" },
        { code: `const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(\`Server running on port \${PORT}\`)
);`, filename: "server.js", copyButton: true, lineNumbers: true },

        { file: "config/db.js" },
        { code: `const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;`, filename: "db.js", copyButton: true },

        { h2: "Environment Variables" },
        { code: `PORT=5000\nMONGO_URI=mongodb://localhost:27017/your_database_name\nJWT_SECRET=your_super_secret_jwt_key_here`, filename: ".env" },
        { warning: "Never commit your .env file to version control. Add it to .gitignore." },

        { h: "User Model" },
        { file: "models/User.js" },
        { code: `const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);`, filename: "User.js", copyButton: true, lineNumbers: true },

        { h: "Authentication Controller" },
        { file: "controllers/authController.js" },
        { code: `const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ msg: "Please fill all fields" });

    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      msg: "Registration successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Please fill all fields" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};`, filename: "authController.js", copyButton: true, lineNumbers: true, collapsible: true },

        { h2: "How Registration Works" },
        { steps: [
          "Validate request body fields",
          "Check if user already exists",
          "Hash password with bcrypt",
          "Create user in MongoDB",
          "Sign a JWT token (7-day expiry)",
          "Return user data and token",
        ]},

        { h2: "How Login Works" },
        { steps: [
          "Validate email and password fields",
          "Find user by email",
          "Compare password hash with bcrypt",
          "Sign a JWT token",
          "Return authenticated user and token",
        ]},

        { h: "JWT Middleware" },
        { file: "middleware/authMiddleware.js" },
        { code: `const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};`, filename: "authMiddleware.js", copyButton: true },
        { p: "Extracts the JWT from the Authorization header, verifies it with your secret, attaches the decoded payload to **req.user**, then calls next() to pass through to the protected route handler." },

        { h: "Authentication Routes" },
        { file: "routes/auth.js" },
        { code: `const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserData } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected
router.get("/me", auth, getUserData);

module.exports = router;`, filename: "auth.js", copyButton: true },

        { h: "Frontend API Layer" },
        { file: "src/services/api.js" },
        { code: `import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

export const register = (userData) => API.post("/auth/register", userData);
export const login    = (userData) => API.post("/auth/login", userData);
export const getMe    = ()         => API.get("/auth/me");`, filename: "api.js", copyButton: true },
        { tip: "Axios interceptors attach the JWT to every outgoing request  no manual header passing needed anywhere." },

        { h2: "Login Page" },
        { code: `import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(formData);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 bg-gray-700 text-white rounded"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;`, filename: "Login.jsx", copyButton: true, lineNumbers: true, collapsible: true },

        { h: "Running the Application" },
        { command: "cd backend && npm run dev" },
        { command: "cd frontend && npm run dev" },
        { note: "Backend runs at http://localhost:5000, frontend at http://localhost:5173." },

        { h: "Next Improvements" },
        { ordered: [
          "Password reset via email",
          "Email verification before activation",
          "Role-based access control (admin / user)",
          "Refresh tokens for better security",
          "Input validation with Joi or express-validator",
          "Rate limiting to protect against brute force",
        ]},

        { spacer: "md" },
        { divider: true },
        { p: "You now have a working MERN authentication system  JWT tokens, protected routes, password hashing, and a frontend that stays logged in across refreshes. Build on it." },
      ]
    },
  ],
};
