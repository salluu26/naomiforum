import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const letter = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function NaomiLoader() {
  const word = "Naomi".split("");

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.35, ease: "easeInOut" },
      }}
    >
      {/* CINEMATIC GLOW */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-purple-500/10" />

      <div className="relative flex flex-col items-center gap-4">
        {/* 🔥 SHARED LOGO (MORPHS TO NAVBAR) */}
        <motion.div
          layoutId="naomi-logo"
          className="flex"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {word.map((char, i) => (
            <motion.span
              key={i}
              variants={letter}
              className="text-5xl sm:text-6xl font-extrabold tracking-tight
                bg-gradient-to-r from-pink-500 to-purple-500
                bg-clip-text text-transparent"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* TAGLINE */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-sm sm:text-base text-white/50 tracking-wide"
        >
          Share freely. React honestly.
        </motion.p>
      </div>
    </motion.div>
  );
}
