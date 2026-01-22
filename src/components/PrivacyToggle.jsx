import { motion } from "framer-motion";

export default function PrivacyToggle({
  icon: Icon,
  label,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between py-3">
      {/* LEFT */}
      <div className="flex items-center gap-3 text-sm text-white/80">
        <Icon size={18} className="text-pink-400" />
        <span>{label}</span>
      </div>

      {/* TOGGLE */}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
          checked
            ? "bg-gradient-to-r from-pink-500 to-pink-400"
            : "bg-white/20"
        }`}
      >
        <motion.span
          animate={{ x: checked ? 24 : 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-black"
        />
      </button>
    </div>
  );
}
