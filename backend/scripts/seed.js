import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

await mongoose.connect("mongodb://127.0.0.1:27017/naomi");

await User.deleteMany();
await Post.deleteMany();
await Comment.deleteMany();

const hashedPassword = await bcrypt.hash("password123", 10);

const users = await User.insertMany([
  {
    username: "luna",
    email: "luna@test.com",
    password: hashedPassword,
    age: 23,
    sex: "female",
    bio: "Late night poster 🌙",
    privacy: {
      showAge: true,
      showSex: true,
      showBio: true,
    },
  },
  {
    username: "alex",
    email: "alex@test.com",
    password: hashedPassword,
    age: 29,
    sex: "male",
    bio: "Just browsing",
    privacy: {
      showAge: true,
      showSex: true,
      showBio: true,
    },
  },
]);

console.log("Seeded users:", users.map(u => u.username));

process.exit();
