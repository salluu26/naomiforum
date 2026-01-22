import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  getComments,
  addComment,
  likeComment,
  dislikeComment,
  deleteComment, // ✅ ADD
} from "../controllers/comment.controller.js";

const router = express.Router();

// 📄 Get comments for post
router.get("/:postId", getComments);

// ➕ Add comment / reply
router.post("/:postId", auth, addComment);

// 👍 Like comment
router.post("/:id/like", auth, likeComment);

// 👎 Dislike comment
router.post("/:id/dislike", auth, dislikeComment);

// 🗑️ Delete comment (OWNER ONLY)
router.delete("/:id", auth, deleteComment);

export default router;
