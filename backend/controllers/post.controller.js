import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   GET POSTS (HOT / NEW)
========================= */
export const getPosts = async (req, res) => {
  try {
    const sort = req.query.sort || "hot";

    // 1️⃣ FETCH POSTS
    let posts = await Post.find()
      .populate("author", "username avatar")
      .lean();

    const postIds = posts.map((p) => p._id);

    // 2️⃣ FETCH COMMENT COUNTS (SINGLE QUERY)
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    commentCounts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    // 3️⃣ ATTACH COMMENT COUNT
    posts = posts.map((post) => ({
      ...post,
      commentsCount: countMap[post._id.toString()] || 0,
    }));

    const now = Date.now();

    // 4️⃣ SORTING
    if (sort === "new") {
      posts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    if (sort === "hot") {
      posts = posts
        .map((post) => {
          const hours =
            (now - new Date(post.createdAt)) / 1000 / 3600;

          const score =
            (post.likes.length - post.dislikes.length) /
            Math.pow(hours + 2, 1.5);

          return { ...post, hotScore: score };
        })
        .sort((a, b) => b.hotScore - a.hotScore)
        .map(({ hotScore, ...rest }) => rest);
    }

    res.json(posts);
  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

/* =========================
   SEARCH POSTS
========================= */
export const searchPosts = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.json([]);

    const regex = new RegExp(q, "i");

    const posts = await Post.find({ title: regex })
      .sort({ createdAt: -1 })
      .populate("author", "username avatar")
      .lean();

    const postIds = posts.map((p) => p._id);

    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    commentCounts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    posts.forEach((p) => {
      p.commentsCount = countMap[p._id.toString()] || 0;
    });

    res.json(posts);
  } catch (err) {
    console.error("SEARCH POSTS ERROR:", err);
    res.status(500).json({ message: "Search failed" });
  }
};

/* =========================
   GET SINGLE POST
========================= */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar")
      .lean();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentsCount = await Comment.countDocuments({
      post: post._id,
    });

    post.commentsCount = commentsCount;

    res.json(post);
  } catch (err) {
    console.error("GET POST ERROR:", err);
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

/* =========================
   CREATE POST
========================= */
export const createPost = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Media file required" });
    }

    const { title } = req.body;

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "naomi/posts",
          resource_type: "auto",
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      ).end(req.file.buffer);
    });

    const post = await Post.create({
      title,
      mediaUrl: uploadResult.secure_url,
      mediaPublicId: uploadResult.public_id,
      mediaType:
        uploadResult.resource_type === "video" ? "video" : "image",
      author: req.user.id,
    });

    res.json({
      ...post.toObject(),
      commentsCount: 0,
    });
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

/* =========================
   LIKE POST
========================= */
export const likePost = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.likes.addToSet(req.user.id);
    post.dislikes.pull(req.user.id);

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("LIKE POST ERROR:", err);
    res.status(500).json({ message: "Failed to like post" });
  }
};

/* =========================
   DISLIKE POST
========================= */
export const dislikePost = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.dislikes.addToSet(req.user.id);
    post.likes.pull(req.user.id);

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("DISLIKE POST ERROR:", err);
    res.status(500).json({ message: "Failed to dislike post" });
  }
};

/* =========================
   DELETE POST (FULL CLEANUP)
========================= */
export const deletePost = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 🔥 DELETE MEDIA
    await cloudinary.uploader.destroy(post.mediaPublicId, {
      resource_type:
        post.mediaType === "video" ? "video" : "image",
    });

    // 🔥 DELETE COMMENTS
    await Comment.deleteMany({ post: post._id });

    // 🔥 DELETE POST
    await post.deleteOne();

    res.json({ message: "Post deleted completely" });
  } catch (err) {
    console.error("DELETE POST ERROR:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
