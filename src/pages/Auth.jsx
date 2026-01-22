import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import {
  Eye,
  EyeOff,
  Chrome,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* FORM STATE */
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  /* USERNAME AVAILABILITY */
  useEffect(() => {
    if (mode !== "register") return;
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await api.get(
          `/auth/check-username?username=${username}`
        );
        setUsernameAvailable(res.data.available);
      } catch {
        setUsernameAvailable(null);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [username, mode]);

  /* VALIDATION */
  const validateLogin = () => {
    if (!identifier || !password) return "All fields are required";
    return null;
  };

  const validateRegister = () => {
    if (!username || !email || !password)
      return "All fields are required";
    if (password.length < 6)
      return "Password must be at least 6 characters";
    if (usernameAvailable === false)
      return "Username is already taken";
    return null;
  };

  /* LOGIN */
  const login = async (e) => {
    e.preventDefault();
    const err = validateLogin();
    if (err) return setError(err);

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", {
        identifier,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccess(true);
      setTimeout(() => navigate("/"), 1200);
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  /* REGISTER */
  const register = async (e) => {
    e.preventDefault();
    const err = validateRegister();
    if (err) return setError(err);

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      setMode("login");
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* FORGOT PASSWORD */
  const forgotPassword = async () => {
    if (!identifier) {
      setError("Enter your email first");
      return;
    }
    await api.post("/auth/forgot-password", {
      email: identifier,
    });
    alert("If the email exists, a reset link was sent.");
  };

  /* GOOGLE OAUTH */
  const googleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0d12] to-black flex items-center justify-center px-4">
      <div className="relative w-full max-w-md bg-[#0f1115] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* SUCCESS OVERLAY */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-10 bg-black/80 flex items-center justify-center"
            >
              <div className="text-center">
                <CheckCircle2 size={48} className="text-green-400 mx-auto" />
                <p className="mt-3 text-lg font-semibold">
                  Success! Redirecting…
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER */}
        <div className="p-6 text-center border-b border-white/10">
          <h1 className="text-2xl font-bold">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {mode === "login"
              ? "Sign in to continue to Naomi"
              : "Join the Naomi community"}
          </p>
        </div>

        {/* FORM */}
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            onSubmit={mode === "login" ? login : register}
            className="p-6 space-y-4"
          >
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            {mode === "register" && (
              <>
                <input
                  className="input"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {usernameAvailable === false && (
                  <p className="text-xs text-red-400">
                    Username already taken
                  </p>
                )}
                {usernameAvailable === true && (
                  <p className="text-xs text-green-400">
                    Username available
                  </p>
                )}

                <input
                  className="input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </>
            )}

            {mode === "login" && (
              <input
                className="input"
                placeholder="Username or Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            )}

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input pr-12"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {mode === "login" && (
              <button
                type="button"
                onClick={forgotPassword}
                className="text-xs text-pink-400 text-right w-full"
              >
                Forgot password?
              </button>
            )}

            {/* SUBMIT */}
            <button
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3 font-semibold text-black disabled:opacity-60"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>

            {/* GOOGLE */}
            <button
              type="button"
              onClick={googleLogin}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2 hover:bg-white/5"
            >
              <Chrome size={18} />
              Continue with Google
            </button>

            {/* TOGGLE */}
            <p className="text-center text-sm text-white/50 pt-2">
              {mode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <span
                    onClick={() => setMode("register")}
                    className="text-pink-400 cursor-pointer"
                  >
                    Sign up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => setMode("login")}
                    className="text-pink-400 cursor-pointer"
                  >
                    Sign in
                  </span>
                </>
              )}
            </p>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}
