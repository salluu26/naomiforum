import Post from "../models/Post.js";
import User from "../models/User.js";

export const globalSearch = async (req, res) => {
  try {
    const q = req.query.q?.trim();

    if (!q) {
      return res.json({ posts: [], users: [] });
    }

    const regex = new RegExp(q, "i");

    const [posts, users] = await Promise.all([
      Post.find({ title: regex })
        .sort({ createdAt: -1 })
        .populate("author", "username avatar")
        .limit(20),

      User.find({ username: regex })
        .select("username avatar")
        .limit(10),
    ]);

    res.json({ posts, users });
  } catch (err) {
    console.error("GLOBAL SEARCH ERROR:", err);
    res.status(500).json({ message: "Search failed" });
  }
};
