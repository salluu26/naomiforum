import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";
import ForumHero from "../components/ForumHero";
import api from "../api/axios";
import { Flame, Clock } from "lucide-react";
import { motion } from "framer-motion";

/* ------------------------------
   SKELETON CARD
------------------------------ */
function PostSkeleton() {
  return (
    <div className="bg-[#0f1115] border border-white/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-white/10" />
        <div className="h-3 w-32 bg-white/10 rounded" />
      </div>
      <div className="h-[320px] bg-black/40" />
      <div className="px-4 py-4 space-y-2">
        <div className="h-4 w-3/4 bg-white/10 rounded" />
        <div className="h-3 w-1/3 bg-white/10 rounded" />
      </div>
    </div>
  );
}

/* ------------------------------
   FEED ANIMATION
------------------------------ */
const feedVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const postVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export default function Home() {
  const location = useLocation();
  const topPostRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("hot");

  /* ------------------------------
     FETCH POSTS
  ------------------------------ */
  useEffect(() => {
    let ignore = false;
    setLoading(true);

    api
      .get(`/posts?sort=${sort}`)
      .then((res) => {
        if (ignore) return;

        let data = Array.isArray(res.data) ? res.data : [];

        // 🔥 Insert newly created post on top
        if (location.state?.newPost) {
          data = [
            { ...location.state.newPost, __isNew: true },
            ...data,
          ];
        }

        setPosts(data);
      })
      .catch(() => {
        if (!ignore) setPosts([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [sort, location.state]);

  /* ------------------------------
     AUTO SCROLL TO NEW POST
  ------------------------------ */
  useEffect(() => {
    if (!location.state?.newPost) return;

    setTimeout(() => {
      topPostRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // clear history state so it doesn't repeat
      window.history.replaceState({}, document.title);
    }, 120);
  }, [location.state]);

  /* ------------------------------
     OPTIMISTIC DELETE
  ------------------------------ */
  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <Layout>
      {/* HERO */}
      <div className="relative">
        <ForumHero />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-black pointer-events-none" />
      </div>

      {/* FEED SURFACE */}
      <div className="relative border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-[#0b0d12] to-black pointer-events-none" />

        {/* SORT BAR */}
        <div className="sticky top-[56px] z-20 bg-[#0b0d12]/90 backdrop-blur">
          <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3 flex gap-2">
            <button
              onClick={() => setSort("hot")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition
                ${
                  sort === "hot"
                    ? "bg-pink-500 text-black shadow"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
            >
              <Flame size={15} />
              Hot
            </button>

            <button
              onClick={() => setSort("new")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition
                ${
                  sort === "new"
                    ? "bg-pink-500 text-black shadow"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
            >
              <Clock size={15} />
              New
            </button>
          </div>

          <div className="h-px bg-white/10" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-2xl mx-auto px-3 sm:px-4 pt-6 pb-24">
          {/* LOADING */}
          {loading && (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          )}

          {/* EMPTY */}
          {!loading && posts.length === 0 && (
            <p className="text-center text-white/50 py-20">
              No posts yet
            </p>
          )}

          {/* FEED */}
          {!loading && posts.length > 0 && (
            <motion.div
              variants={feedVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  variants={postVariants}
                  ref={post.__isNew && index === 0 ? topPostRef : null}
                >
                  <PostCard
                    post={post}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
