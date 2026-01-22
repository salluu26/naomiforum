import { motion } from "framer-motion";

export default function LikeHeart() {
  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 24 24"
      fill="none"
      className="absolute inset-0 m-auto"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1.4, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <path
        d="M12 21s-6.716-4.438-9.33-7.056C-1.362 10.912 1.094 4.5 6.25 4.5c2.27 0 3.75 1.25 4.75 2.5 1-1.25 2.48-2.5 4.75-2.5 5.156 0 7.612 6.412 3.58 9.444C18.716 16.562 12 21 12 21z"
        fill="#ff2d55"
      />
    </motion.svg>
  );
}
