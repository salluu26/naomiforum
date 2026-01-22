import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  description,
  confirmText = "Delete",
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="bg-[#0f1115] border border-white/10 rounded-2xl p-6 w-full max-w-sm"
        >
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-white/60 mb-5">{description}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-500 text-black font-semibold hover:bg-red-400"
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
