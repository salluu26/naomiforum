import Comment from "../models/Comment.js";

/* =========================
   GET COMMENTS FOR A POST
========================= */
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    })
      .sort({ createdAt: 1 })
      .populate("author", "username avatar");

    res.json(comments);
  } catch (err) {
    console.error("GET COMMENTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

/* =========================
   ADD COMMENT / REPLY
========================= */
export const addComment = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.body.text || !req.body.text.trim()) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const comment = await Comment.create({
      text: req.body.text.trim(),
      post: req.params.postId,
      author: req.user.id,
      parent: req.body.parent || null,
    });

    const populated = await comment.populate(
      "author",
      "username avatar"
    );

    res.json(populated);
  } catch (err) {
    console.error("ADD COMMENT ERROR:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

/* =========================
   LIKE COMMENT
========================= */
export const likeComment = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.likes.addToSet(req.user.id);
    comment.dislikes.pull(req.user.id);

    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error("LIKE COMMENT ERROR:", err);
    res.status(500).json({ message: "Failed to like comment" });
  }
};

/* =========================
   DISLIKE COMMENT
========================= */
export const dislikeComment = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.dislikes.addToSet(req.user.id);
    comment.likes.pull(req.user.id);

    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error("DISLIKE COMMENT ERROR:", err);
    res.status(500).json({ message: "Failed to dislike comment" });
  }
};

/* =========================
   DELETE COMMENT
========================= */
export const deleteComment = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // 🔐 Owner check
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await comment.deleteOne();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("DELETE COMMENT ERROR:", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};
