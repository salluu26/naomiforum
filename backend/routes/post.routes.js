import express from "express";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  getPosts,
  getPostById,
  createPost,
  likePost,
  dislikePost,
  searchPosts,
  deletePost, // ✅ ADD
} from "../controllers/post.controller.js";

const router = express.Router();

/* =========================
   POSTS
========================= */

// 🔍 Search posts (MUST be before :id)
router.get("/search", searchPosts);

// 📄 Get all posts
router.get("/", getPosts);

// 📄 Get single post
router.get("/:id", getPostById);

// ➕ Create post (media upload)
router.post("/", auth, upload.single("media"), createPost);

// 👍 Like
router.post("/:id/like", auth, likePost);

// 👎 Dislike
router.post("/:id/dislike", auth, dislikePost);

// 🗑️ Delete post (OWNER ONLY)
router.delete("/:id", auth, deletePost);

export default router;
