


// server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// In-memory store for posts
let posts = [];

/**
 * Route: POST /post
 * Create a new post with text and optional image
 */
app.post("/post", upload.single("image"), (req, res) => {
  const { text } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!text && !imageUrl) {
    return res.status(400).json({ error: "Post must contain text or image." });
  }

  const newPost = {
    id: posts.length + 1,
    text,
    image: imageUrl,
    createdAt: new Date(),
  };

  posts.unshift(newPost); // add to top
  res.status(201).json(newPost);
});

/**
 * Route: GET /posts
 * Fetch all posts
 */
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

