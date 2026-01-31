const blogPosts = [
  {
    id: 1,
    slug: "mern-stack-authentication-walkthrough",
    title: "MERN Stack Authentication: A Complete Walkthrough",
    excerpt: "Learn how to set up a complete MERN (MongoDB, Express, React, Node.js) application with authentication from scratch. This comprehensive guide covers frontend setup with Vite and Tailwind, backend API with JWT auth, and everything in between.",
    content: `
## Introduction

Building a full-stack application can seem overwhelming at first, but breaking it down into manageable steps makes the process much more approachable. In this comprehensive guide, we'll set up a complete **MERN stack** application with user authentication using **JWT (JSON Web Tokens)**.

By the end of this tutorial, you'll have:
- A React frontend with Vite and Tailwind CSS
- An Express.js backend with MongoDB
- Complete user authentication (Register, Login, Protected Routes)
- A solid project structure you can build upon

Let's dive in!

## Part 1: Frontend Setup with Vite

### Step 1: Create the Project Folder

First, create a folder named \`Frontend\` and initialize a new Vite project:

\`\`\`bash
npm create vite@latest frontend -- --template react
\`\`\`

This creates a new React project with Vite's lightning-fast build tooling.

### Step 2: Install Frontend Dependencies

Navigate into your frontend folder and install the essential packages:

\`\`\`bash
cd frontend
npm install react-router-dom axios
\`\`\`

- **react-router-dom**: Handles client-side routing
- **axios**: Makes HTTP requests to our backend API

### Step 3: Create Your Pages

Create a \`pages\` folder inside \`src\` and add these files:

\`\`\`
src/
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── NotFound.jsx
\`\`\`

### Step 4: Setup Routing in App.jsx

Configure your routes in \`App.jsx\`:

\`\`\`jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

export default App;
\`\`\`

### Step 5: Create a Basic Component

Here's an example of a simple React component:

\`\`\`jsx
function MyComponent() {
  return (
    <>
      <h1>Hello</h1>
      <p>Welcome to my app!</p>
    </>
  );
}

export default MyComponent;
\`\`\`

**Pro Tip**: Use fragments (\`<></>\`) when you need to return multiple elements without adding extra DOM nodes.

## Part 2: Styling with Tailwind CSS

### Step 1: Install Tailwind Dependencies

\`\`\`bash
npm install tailwindcss @tailwindcss/vite
\`\`\`

### Step 2: Update vite.config.js

Configure Vite to use Tailwind:

\`\`\`javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
\`\`\`

### Step 3: Import Tailwind in Your CSS

Add this line to your \`src/index.css\` or \`App.css\`:

\`\`\`css
@import "tailwindcss";
\`\`\`

Now you can use Tailwind classes throughout your application!

## Part 3: Backend Setup with Express

### Step 1: Create Backend Folder Structure

Create a \`backend\` folder with this structure:

\`\`\`
backend/
├── server.js
├── package.json
├── .env
├── config/
│   └── db.js
├── models/
│   └── User.js
├── routes/
│   └── auth.js
├── controllers/
│   └── authController.js
└── middleware/
    └── authMiddleware.js
\`\`\`

### Step 2: Initialize and Install Dependencies

\`\`\`bash
cd backend
npm init -y
npm install express mongoose bcrypt jsonwebtoken cors dotenv
npm install nodemon --save-dev
\`\`\`

**Package breakdown:**
- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variables
- **nodemon**: Auto-restart server on changes (development)

### Step 3: Update package.json Scripts

Add these scripts to your \`package.json\`:

\`\`\`json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
\`\`\`

## Part 4: Backend Core Files

### server.js - Main Entry Point

\`\`\`javascript
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));

// Health Check
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(\`Server running on port \${PORT}\`)
);
\`\`\`

### config/db.js - Database Connection

\`\`\`javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
\`\`\`

### .env - Environment Variables

Create a \`.env\` file in your backend folder:

\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/your_database_name
JWT_SECRET=your_super_secret_jwt_key_here
\`\`\`

**Important**: Never commit your \`.env\` file to version control! Add it to \`.gitignore\`.

## Part 5: User Model

### models/User.js

\`\`\`javascript
const mongoose = require("mongoose");

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

module.exports = mongoose.model("User", userSchema);
\`\`\`

The \`timestamps: true\` option automatically adds \`createdAt\` and \`updatedAt\` fields.

## Part 6: Authentication Controller

### controllers/authController.js

This file contains all the authentication logic:

\`\`\`javascript
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      msg: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get Current User (Protected Route)
exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
\`\`\`

## Part 7: JWT Authentication Middleware

### middleware/authMiddleware.js

This middleware protects routes that require authentication:

\`\`\`javascript
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
\`\`\`

**How it works:**
1. Extracts the JWT from the Authorization header
2. Verifies the token using your secret key
3. Attaches the decoded user data to \`req.user\`
4. Calls \`next()\` to continue to the protected route

## Part 8: Authentication Routes

### routes/auth.js

\`\`\`javascript
const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserData 
} = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/auth/me
// @desc    Get current user data
// @access  Private
router.get("/me", auth, getUserData);

module.exports = router;
\`\`\`

## Part 9: Frontend API Integration

### Create an API Service

Create \`src/services/api.js\` in your frontend:

\`\`\`javascript
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export const register = (userData) => API.post("/auth/register", userData);
export const login = (userData) => API.post("/auth/login", userData);
export const getMe = () => API.get("/auth/me");
\`\`\`

### Example Login Component

\`\`\`jsx
import { useState } from "react";
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

export default Login;
\`\`\`

## Running Your Application

### Start the Backend

\`\`\`bash
cd backend
npm run dev
\`\`\`

### Start the Frontend

\`\`\`bash
cd frontend
npm run dev
\`\`\`

Your API will be running at \`http://localhost:5000\` and your frontend at \`http://localhost:5173\`.

## Next Steps

Now that you have a working MERN stack with authentication, consider adding:

1. **Password Reset**: Implement email-based password recovery
2. **Email Verification**: Verify user emails before activation
3. **Role-Based Access**: Add admin/user roles
4. **Refresh Tokens**: Implement token refresh for better security
5. **Input Validation**: Use libraries like Joi or express-validator
6. **Rate Limiting**: Protect against brute force attacks

## Conclusion

Congratulations! You've built a complete MERN stack application with JWT authentication. This setup provides a solid foundation for building more complex features. The modular structure makes it easy to add new routes, controllers, and models as your application grows.

Happy coding! 🚀
`,
    date: "2026-01-31",
    readTime: "15 min read",
    tags: ["React", "Node.js", "MongoDB", "Express", "Full-Stack"],
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
  }
];

export default blogPosts;
