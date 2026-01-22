import { useState } from "react";
import api from "../api/axios";
import CommentItem from "./CommentItem";
import { Send } from "lucide-react";

export default function CommentBox({ postId, comments, setComments }) {
  const [text, setText] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  const submit = async () => {
    if (!isLoggedIn) {
      alert("Login required");
      return;
    }

    if (!text.trim()) return;

    const res = await api.post(`/comments/${postId}`, { text });
    setComments([...comments, res.data]);
    setText("");
  };

  const roots = comments.filter((c) => !c.parent);

  return (
    <div className="bg-[#0f1115] border border-white/10 rounded-2xl overflow-hidden">

      {/* HEADER */}
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white/70">
          Discussion
        </h3>
      </div>

      {/* INPUT */}
      <div className="px-4 py-4 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isLoggedIn
              ? "Add a comment…"
              : "Login to join the discussion"
          }
          disabled={!isLoggedIn}
          className="w-full min-h-[80px] resize-none rounded-xl
            bg-black/40 border border-white/10
            px-4 py-3 text-sm leading-relaxed
            outline-none focus:border-pink-500
            transition disabled:opacity-50"
        />

        <div className="flex justify-end">
          <button
            onClick={submit}
            disabled={!isLoggedIn || !text.trim()}
            className={`inline-flex items-center gap-2
              px-4 py-2 rounded-lg text-sm font-semibold
              transition
              ${
                !isLoggedIn || !text.trim()
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-purple-500 text-white active:scale-95"
              }`}
          >
            <Send size={14} />
            Comment
          </button>
        </div>
      </div>

      {/* COMMENTS */}
      <div className="px-4 py-4 border-t border-white/10 space-y-4">
        {roots.length === 0 && (
          <p className="text-sm text-white/40">
            No comments yet. Be the first to start the discussion.
          </p>
        )}

        {roots.map((c) => (
          <CommentItem
            key={c._id}
            comment={c}
            allComments={comments}
            setComments={setComments}
          />
        ))}
      </div>
    </div>
  );
}
