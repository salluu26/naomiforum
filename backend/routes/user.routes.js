import express from "express";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  getMyProfile,
  updateProfile,
  deleteMyAccount,
} from "../controllers/user.controller.js";

const router = express.Router();

/* =========================
   AUTHENTICATED USER ROUTES
========================= */

// Get logged-in user's profile
router.get("/me", auth, getMyProfile);

// Update profile + avatar
router.put("/me", auth, upload.single("avatar"), updateProfile);

// Delete account
router.delete("/me", auth, deleteMyAccount);

export default router;
