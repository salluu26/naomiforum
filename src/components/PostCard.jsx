import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { timeAgo } from "../utils/timeAgo";
import ConfirmModal from "./ConfirmModal";

const BRAND_NEW_WINDOW_MS = 60 * 1000; // 🔥 1 minute

export default function PostCard({ post, onDelete }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const isOwner = user?.id === post.author?._id;

  const videoRef = useRef(null);

  const [likes, setLikes] = useState(post.likes.length);
  const [dislikes, setDislikes] = useState(post.dislikes.length);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [likedAnim, setLikedAnim] = useState(false);

  /* =========================
     BRAND-NEW POST CHECK
  ========================= */
  const isBrandNew =
    Date.now() - new Date(post.createdAt).getTime() <
    BRAND_NEW_WINDOW_MS;

  const [showOwnBadge, setShowOwnBadge] = useState(
    isOwner && isBrandNew
  );

  /* AUTO-HIDE BADGE AFTER 10s */
  useEffect(() => {
    if (!showOwnBadge) return;

    const timer = setTimeout(() => {
      setShowOwnBadge(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [showOwnBadge]);

  /* =========================
     SAFE VIDEO AUTOPLAY
  ========================= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isPlaying = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const p = video.play();
          if (p) p.then(() => (isPlaying = true)).catch(() => {});
        } else if (isPlaying && !video.paused) {
          video.pause();
          isPlaying = false;
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  /* =========================
     LIKE
  ========================= */
  const like = async () => {
    if (!localStorage.getItem("token")) {
      alert("Login required");
      return;
    }

    const res = await api.post(`/posts/${post._id}/like`);
    setLikes(res.data.likes.length);
    setDislikes(res.data.dislikes.length);

    setLikedAnim(true);
    setTimeout(() => setLikedAnim(false), 550);
  };

  /* =========================
     DISLIKE
  ========================= */
  const dislike = async () => {
    if (!localStorage.getItem("token")) {
      alert("Login required");
      return;
    }

    const res = await api.post(`/posts/${post._id}/dislike`);
    setLikes(res.data.likes.length);
    setDislikes(res.data.dislikes.length);
  };

  /* =========================
     DELETE POST
  ========================= */
  const deletePost = async () => {
    setConfirmOpen(false);
    onDelete(post._id);

    try {
      await api.delete(`/posts/${post._id}`);
    } catch {
      alert("Delete failed");
      window.location.reload();
    }
  };

  return (
    <>
      <div className="bg-[#0f1115] border border-white/10 rounded-2xl overflow-hidden shadow-lg">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 text-sm">
            <img
              src={
                post.author?.avatar ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${post.author?.username}`
              }
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />

            <div className="flex items-center gap-2 text-white/60">
              <span className="font-semibold text-white">
                @{post.author.username}
              </span>

              {/* 🔥 BRAND-NEW BADGE */}
              <AnimatePresence>
                {showOwnBadge && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded-full
                      bg-pink-500/20 text-pink-400 border border-pink-500/30
                      shadow-[0_0_14px_rgba(236,72,153,0.55)]"
                  >
                    Your post
                  </motion.span>
                )}
              </AnimatePresence>

              <span>•</span>
              <span>{timeAgo(post.createdAt)}</span>
            </div>
          </div>

          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <MoreVertical size={16} />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 mt-2 bg-[#12141a] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setConfirmOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* MEDIA */}
        <div
          className="relative bg-black flex items-center justify-center"
          onDoubleClick={like}
        >
          {post.mediaType === "image" ? (
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="w-full max-h-[520px] object-contain"
              loading="lazy"
            />
          ) : (
            <video
              ref={videoRef}
              src={post.mediaUrl}
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full max-h-[520px] object-contain"
            />
          )}

          {/* DOUBLE TAP HEART */}
          <AnimatePresence>
            {likedAnim && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.6, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 260 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-20 h-20 fill-pink-500 drop-shadow-xl"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CONTENT */}
        <div className="px-4 py-3 space-y-2">
          <p className="text-sm font-medium leading-snug">
            {post.title}
          </p>

          <div className="flex items-center gap-6 text-sm text-white/60">
            <button
              onClick={like}
              className="flex items-center gap-1 hover:text-pink-400 transition"
            >
              <ThumbsUp size={15} />
              {likes}
            </button>

            <button
              onClick={dislike}
              className="flex items-center gap-1 hover:text-blue-400 transition"
            >
              <ThumbsDown size={15} />
              {dislikes}
            </button>

            <div className="flex items-center gap-1 text-white/50">
              <MessageCircle size={15} />
              {post.commentsCount ?? 0}
            </div>

            <Link
              to={`/post/${post._id}`}
              className="ml-auto text-pink-400 hover:underline"
            >
              Discussion
            </Link>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete post?"
        description="This action cannot be undone."
        onConfirm={deletePost}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
