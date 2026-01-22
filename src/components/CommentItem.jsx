import { useState } from "react";
import api from "../api/axios";
import { timeAgo } from "../utils/timeAgo";
import {
  ThumbsUp,
  ThumbsDown,
  CornerDownRight,
  Trash2,
} from "lucide-react";

export default function CommentItem({
  comment,
  allComments,
  setComments,
  depth = 0,
}) {
  const replies = allComments.filter(
    (c) => c.parent === comment._id
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const isOwner = user?.id === comment.author?._id;

  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState("");

  const react = async (type) => {
    const res = await api.post(
      `/comments/${comment._id}/${type}`
    );

    setComments(
      allComments.map((c) =>
        c._id === comment._id ? res.data : c
      )
    );
  };

  const submitReply = async () => {
    if (!reply.trim()) return;

    const res = await api.post(`/comments/${comment.post}`, {
      text: reply,
      parent: comment._id,
    });

    setComments([...allComments, res.data]);
    setReply("");
    setReplyOpen(false);
  };

  const deleteComment = async () => {
    // OPTIMISTIC REMOVE (comment + replies)
    setComments(
      allComments.filter(
        (c) =>
          c._id !== comment._id &&
          c.parent !== comment._id
      )
    );

    try {
      await api.delete(`/comments/${comment._id}`);
    } catch {
      alert("Failed to delete comment");
      window.location.reload();
    }
  };

  const indent = Math.min(depth * 16, 64);

  return (
    <div style={{ marginLeft: indent }} className="relative">
      {depth > 0 && (
        <span className="absolute left-[-10px] top-0 h-full w-px bg-white/10" />
      )}

      <div className="flex gap-3 px-2 py-3 rounded-lg hover:bg-white/[0.03] transition">
        {/* AVATAR */}
        <img
          src={
            comment.author?.avatar ||
            `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.author?.username}`
          }
          alt="avatar"
          className="w-7 h-7 rounded-full object-cover mt-0.5 shrink-0"
        />

        {/* CONTENT */}
        <div className="flex-1 space-y-1">
          {/* HEADER */}
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="font-semibold text-white/80">
              @{comment.author.username}
            </span>
            <span>•</span>
            <span>{timeAgo(comment.createdAt)}</span>
          </div>

          {/* TEXT */}
          <p className="text-sm text-white/80 leading-snug">
            {comment.text}
          </p>

          {/* ACTION BAR */}
          <div className="flex items-center gap-5 text-xs text-white/40 pt-1">
            <button
              onClick={() => react("like")}
              className="flex items-center gap-1 hover:text-pink-400 transition"
            >
              <ThumbsUp size={14} />
              {comment.likes.length}
            </button>

            <button
              onClick={() => react("dislike")}
              className="flex items-center gap-1 hover:text-blue-400 transition"
            >
              <ThumbsDown size={14} />
              {comment.dislikes.length}
            </button>

            <button
              onClick={() => setReplyOpen(!replyOpen)}
              className="flex items-center gap-1 hover:text-white transition"
            >
              <CornerDownRight size={14} />
              Reply
            </button>

            {/* DELETE — OWNER ONLY */}
            {isOwner && (
              <button
                onClick={deleteComment}
                className="ml-auto flex items-center gap-1 text-red-400 hover:text-red-500 transition"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>

          {/* REPLY BOX */}
          {replyOpen && (
            <div className="mt-3 space-y-2">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a reply…"
                className="w-full min-h-[70px] rounded-xl
                  bg-black/40 border border-white/10
                  px-3 py-2 text-sm
                  outline-none focus:border-pink-500 transition"
              />

              <div className="flex gap-2">
                <button
                  onClick={submitReply}
                  className="px-3 py-1.5 text-xs rounded-lg
                    bg-white/10 hover:bg-white/20 transition"
                >
                  Reply
                </button>

                <button
                  onClick={() => setReplyOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-lg
                    text-white/40 hover:text-white transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REPLIES */}
      {replies.map((r) => (
        <CommentItem
          key={r._id}
          comment={r}
          allComments={allComments}
          setComments={setComments}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
