import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Plus,
  LogIn,
  LogOut,
  User,
  X,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  /* -------------------------
     USER STATE (SYNC SAFE)
  ------------------------- */
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const menuRef = useRef(null);

  /* Sync user when storage changes */
  useEffect(() => {
    const syncUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("storage", syncUser);
    syncUser();
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* LOGO — MORPH TARGET */}
            <motion.div layoutId="naomi-logo">
              <Link
                to="/"
                className="text-xl font-extrabold tracking-tight
      bg-gradient-to-r from-pink-500 to-purple-500
      bg-clip-text text-transparent"
              >
                Naomi
              </Link>
            </motion.div>


            <Link
              to="/"
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition"
              title="Home"
            >
              <Home size={20} />
            </Link>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <Search size={16} className="text-white/50" />
            <input
              placeholder="Search posts..."
              className="bg-transparent outline-none text-sm text-white placeholder-white/40 w-56"
            />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* MOBILE SEARCH */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5"
            >
              <Search size={20} />
            </button>

            {/* CREATE POST */}
            {user && (
              <button
                onClick={() => navigate("/upload")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-gradient-to-r from-pink-500 to-purple-500
                  text-white font-semibold text-sm
                  active:scale-95 transition"
              >
                <Plus size={16} />
                Post
              </button>
            )}

            {/* AUTH / PROFILE */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5"
                >
                  <LogIn size={20} />
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl border border-white/15 text-sm hover:bg-white/5 transition"
                >
                  Join
                </Link>
              </>
            ) : (
              <div ref={menuRef} className="relative">
                {/* AVATAR — MORPH TARGET */}
                <button
                  id="naomi-avatar"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden
                    border border-white/20 bg-black
                    ring-2 ring-pink-500/20"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center
                        font-bold text-white
                        bg-gradient-to-br from-pink-500 to-purple-500"
                    >
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </button>

                {/* DROPDOWN */}
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-6 w-56 rounded-2xl
                        bg-[#0f1115] border border-white/15
                        shadow-2xl p-3 space-y-2"
                    >
                      <div className="px-2">
                        <div className="font-semibold text-sm">
                          @{user.username}
                        </div>
                        <div className="text-xs text-white/40">
                          Logged in
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2
                          rounded-lg hover:bg-white/5 transition text-sm"
                      >
                        <User size={16} />
                        Edit profile
                      </button>

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2
                          rounded-lg hover:bg-red-500/10
                          text-red-400 transition text-sm"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE SEARCH MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm
              flex items-start justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl
                bg-[#0f1115] border border-white/10 p-4"
            >
              <div className="flex items-center gap-2">
                <Search size={18} className="text-white/50" />
                <input
                  autoFocus
                  placeholder="Search posts..."
                  className="w-full bg-transparent outline-none
                    text-white placeholder-white/40"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-white/50 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
