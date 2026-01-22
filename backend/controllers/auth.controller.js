import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/* =========================
   HELPERS
========================= */

const signToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (exists) {
      return res.status(400).json({
        message: "Username or email already in use",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed,
    });

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

/* =========================
   CHECK USERNAME AVAILABILITY
========================= */
// GET /api/auth/check-username?username=john
export const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ available: false });
    }

    const exists = await User.findOne({ username });

    res.json({
      available: !exists,
    });
  } catch (err) {
    console.error("CHECK USERNAME ERROR:", err);
    res.status(500).json({ available: false });
  }
};

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "If the email exists, a reset link was sent",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 1000 * 60 * 30; // 30 min
    await user.save();

    // ⚠️ Email sending intentionally omitted
    // You can wire Nodemailer / Resend later

    res.json({
      message: "Password reset link sent",
      token: resetToken, // remove in production
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Failed to process request" });
  }
};

/* =========================
   GOOGLE OAUTH CALLBACK
========================= */
export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user.username) {
      // User logged in with Google but hasn't chosen username yet
      return res.redirect(
        `${process.env.CLIENT_URL}/complete-profile?token=${signToken(
          user._id
        )}`
      );
    }

    const token = signToken(user._id);

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${token}`
    );
  } catch (err) {
    console.error("GOOGLE CALLBACK ERROR:", err);
    res.redirect(`${process.env.CLIENT_URL}/login`);
  }
};
