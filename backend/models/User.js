import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* =========================
       CORE AUTH
    ========================= */
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    /* =========================
       OAUTH (GOOGLE)
    ========================= */
    googleId: {
      type: String,
      default: null,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    /* =========================
       PASSWORD RESET
    ========================= */
    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },

    /* =========================
       PROFILE
    ========================= */
    avatar: {
      type: String,
      default: "",
    },

    avatarPublicId: {
      type: String,
      default: "",
    },

    age: {
      type: Number,
      min: 18,
      default: 18,
    },

    sex: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    /* =========================
       PRIVACY
    ========================= */
    showAge: {
      type: Boolean,
      default: true,
    },

    showSex: {
      type: Boolean,
      default: true,
    },

    showBio: {
      type: Boolean,
      default: true,
    },

    /* =========================
       STATUS / META
    ========================= */
    isVerified: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
