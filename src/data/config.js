export const PORTFOLIO = {
  name: "Shamit",
  fullName: "Shamit Mishra",
  role: "Software Engineer · Full-Stack",
  location: "India · Remote",
  eyebrow: "COMPUTER SCIENTIST · ENGINEER · BUILDER",

  hero: {
    line1: "Shamit",
    line2: "Mishra.",
    sub: "I design and build modern web applications, resilient backend systems, and AI-powered products engineering experiences that connect, compute, and inspire.",
  },

  about: {
    lede: "I'm a computer science graduate and software engineer who treats the browser as a canvas and the server as a craft.",
    body: [
      "From pixel-precise interfaces to distributed systems that stay calm under load, I build across the whole stack and lately, the intelligence layer that sits on top of it.",
      "Curious by default and collaborative by nature, I care about the seams: the moment data becomes interface, the millisecond a request resolves, the feeling a product leaves behind.",
    ],
    stats: [
      { n: "25+", l: "Repos shipped" },
      { n: "6+", l: "Core languages" },
      { n: "∞", l: "Commits & counting" },
    ],
  },

  featured: [
    {
      num: "01",
      name: "Avni",
      tagline: "Every role. One workspace.",
      desc: "A multi-role digital workspace platform for Individuals, Startups, Accelerators, Incubators, Mentors, Investors, and Enterprises. Features workspace management, program creation, dynamic application workflows, and role-based access control.",
      role: "Full-stack · Team",
      year: "2026",
      stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Three.js", "Framer Motion", "Express", "MongoDB", "JWT Auth"],
      gradient: "ocean",
      mock: "browser",
      screenshot: "/screenshots/avni.png",
      url: "https://avni.app",
      repo: "#",
    },
    {
      num: "02",
      name: "Nexara",
      tagline: "Freelancing reimagined.",
      desc: "A full-stack freelancing platform connecting employers with skilled freelancers. Features include job posting, real-time messaging, secure escrow-based payments, reviews & ratings, and role-based workflows for employers and freelancers.",
      role: "Full-stack · MERN",
      year: "2026",
      stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "JWT Auth"],
      gradient: "teal",
      mock: "browser",
      mockUrl: "nexara.iamshamit.app",
      screenshot: "/screenshots/nexara.png",
      url: "https://nexara.iamshamit.xyz/",
      repo: "https://github.com/iamshamit/Freelancer",
    },
    {
      num: "03",
      name: "Rahi",
      tagline: "Fleet tracking, real-time.",
      desc: "A comprehensive IoT tracking and fleet management dashboard. Features real-time device tracking, team collaboration, subscription management, and integrated Razorpay payments.",
      role: "Full-stack · Team",
      year: "2026",
      stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Google OAuth", "Razorpay"],
      gradient: "aurora",
      mock: "browser",
      mockUrl: "rahi.r2e.in",
      screenshot: "/screenshots/rahi.png",
      url: "https://rahi.r2e.in",
      repo: "#",
    },
  ],

  gallery: [
    { num: "04", name: "Portfolio", tag: "Personal Portfolio", stack: "React · Vite · Framer Motion", gradient: "aurora", url: "https://shamit.is-a.dev", screenshot: "/screenshots/portfolio.png" },
    { num: "05", name: "SpendWise", tag: "Finance Tracker", stack: "React · Node.js · MongoDB", gradient: "teal", url: "https://spendwise.iamshamit.com", screenshot: "/screenshots/spendwise.png" },
    { num: "06", name: "FMHY Search", tag: "Flow Launcher Plugin", stack: "Python", gradient: "ocean", url: "https://www.flowlauncher.com/plugins/fmhy-search-3f7a2b1c-9e4d-4f8a-b3c2-1a5d8e7f0b9c/", screenshot: "/screenshots/fmhy-search.png" },
    { num: "07", name: "Pasta", tag: "Text Sharing", stack: "React · Node.js · MongoDB", gradient: "ember", url: "https://pasta.iamshamit.com", screenshot: "/screenshots/pasta.png" },
  ],

  skills: [
    { group: "Languages", items: ["TypeScript", "Python", "Go", "JavaScript", "Java", "SQL"] },
    { group: "Frontend", items: ["React", "Next.js", "GSAP", "Three.js", "Tailwind"] },
    { group: "Backend", items: ["Node.js", "Hono.js", "Redis"] },
    { group: "Infra", items: ["Docker", "AWS", "CI / CD"] },
  ],

  timeline: [
    { when: "2025  Present", what: "Backend & API Developer Intern", where: "R2E Technologies Pvt. Ltd.", note: "Building backend services and REST APIs for IoT and fleet tracking products at a product-focused startup." },
    { when: "2020  2026", what: "B.Tech Computer Science & Engineering", where: "GIET, Rayagada, Odisha", note: "Computer Science & Engineering with focus on full-stack development, distributed systems, and software engineering fundamentals." },
  ],

  github: {
    handle: "@iamshamit",
    blurb: "Most of my work is open. Components, experiments, and the occasional weekend rabbit hole.",
    stats: [
      { n: "25+", l: "Repositories" },
      { n: "100+", l: "Contributions / yr" },
      { n: "10+", l: "Stars earned" },
    ],
  },

  contact: {
    email: "shamitmishra22@gmail.com",
    socials: [
      { label: "GitHub", href: "https://github.com/iamshamit" },
      { label: "LinkedIn", href: "https://linkedin.com/in/iamshamit" },
      { label: "Resume", href: "#" },
      { label: "Email", href: "mailto:shamitmishra22@gmail.com" },
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
