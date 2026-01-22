import express from "express";
import passport from "passport";
import {
  register,
  login,
  checkUsername,
  forgotPassword,
  googleCallback,
} from "../controllers/auth.controller.js";

const router = express.Router();

/* =========================
   AUTH – LOCAL
========================= */

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

// Check username availability
// GET /api/auth/check-username?username=john
router.get("/check-username", checkUsername);

// Forgot password
router.post("/forgot-password", forgotPassword);

/* =========================
   AUTH – GOOGLE OAUTH
========================= */

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleCallback
);

export default router;
