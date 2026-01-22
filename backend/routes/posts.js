import express from "express";
import upload from "../middleware/upload.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, upload.single("media"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(
      req.file,
      "naomi/posts"
    );

    const post = await Post.create({
      title: req.body.title,
      mediaUrl: result.secure_url,
      mediaType: result.resource_type === "video" ? "video" : "image",
      author: req.user.id,
    });

    const populatedPost = await post.populate("author");

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
