import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import sharp from "sharp";

/* =========================
   GET OWN PROFILE
========================= */
export const getMyProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* =========================
   UPDATE PROFILE + AVATAR
========================= */
export const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {
      username: req.body.username,
      age: Number(req.body.age),
      sex: req.body.sex || "",
      bio: req.body.bio || "",

      showAge: req.body.showAge === "true" || req.body.showAge === true,
      showSex: req.body.showSex === "true" || req.body.showSex === true,
      showBio: req.body.showBio === "true" || req.body.showBio === true,
    };

    /* =========================
       AVATAR REPLACEMENT LOGIC
    ========================= */
    if (req.file) {
      // 1️⃣ Compress & normalize image
      const buffer = await sharp(req.file.buffer)
        .resize(512, 512, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toBuffer();

      // 2️⃣ Delete old avatar (if exists)
      if (user.avatarPublicId) {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      }

      // 3️⃣ Upload new avatar
      const upload = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "naomi/avatars",
            resource_type: "image",
          },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        ).end(buffer);
      });

      updates.avatar = upload.secure_url;
      updates.avatarPublicId = upload.public_id;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};
/* =========================
   DELETE ACCOUNT + AVATAR
========================= */
export const deleteMyAccount = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🗑️ Delete avatar from Cloudinary if it exists
    if (user.avatarPublicId) {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    }

    // 🗑️ Delete user from DB
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("DELETE ACCOUNT ERROR:", err);
    res.status(500).json({ message: "Failed to delete account" });
  }
};