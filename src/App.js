import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Upload from "./pages/Upload";
import Post from "./pages/Post";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import NaomiLoader from "./components/NaomiLoader";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Show loader only once per tab (Netflix / Instagram style)
    const alreadyLoaded = sessionStorage.getItem("naomi_loaded");

    if (alreadyLoaded) {
      setLoading(false);
      return;
    }

    sessionStorage.setItem("naomi_loaded", "true");

    // 🎬 Slightly slower for cinematic feel
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1400); // ⏱️ sweet spot (not sluggish, not rushed)

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 🎬 NETFLIX-STYLE LOADER */}
      <AnimatePresence mode="wait">
        {loading && <NaomiLoader />}
      </AnimatePresence>

      {/* 🚀 MAIN APP */}
      {!loading && (
        <BrowserRouter>
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />

            {/* POSTS */}
            <Route path="/post/:id" element={<Post />} />

            {/* AUTH REQUIRED */}
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}
