import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import CommentBox from "../components/CommentBox";
import api from "../api/axios";
import { timeAgo } from "../utils/timeAgo";
import { ArrowLeft, MessageCircle } from "lucide-react";

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    api.get(`/posts/${id}`).then((res) => setPost(res.data));
    api.get(`/comments/${id}`).then((res) => setComments(res.data));
  }, [id]);

  if (!post) return <Layout />;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-3 sm:px-4 pb-12">

        {/* STICKY TOP BAR */}
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-white/10 -mx-3 sm:-mx-4 px-3 sm:px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-white/10 transition"
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">
                @{post.author.username}
              </span>
              <span className="text-xs text-white/40">
                {timeAgo(post.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* POST CARD */}
        <div className="mt-4 bg-[#0f1115] border border-white/10 rounded-2xl overflow-hidden shadow-lg">

          {/* MEDIA */}
          <div className="relative bg-black flex items-center justify-center max-h-[75vh]">
            {post.mediaType === "image" ? (
              <img
                src={post.mediaUrl}
                alt={post.title}
                className="w-full object-contain max-h-[75vh]"
              />
            ) : (
              <video
                src={post.mediaUrl}
                muted
                autoPlay
                loop
                playsInline
                className="w-full object-contain max-h-[75vh]"
              />
            )}
          </div>

          {/* CONTENT */}
          <div className="px-4 sm:px-5 py-4 space-y-3">
            <h1 className="text-base sm:text-lg font-semibold leading-snug">
              {post.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-white/50">
              <MessageCircle size={15} />
              <span>{comments.length} comments</span>
            </div>
          </div>
        </div>

        {/* COMMENTS */}
        <div className="mt-6 sm:mt-8">
          <CommentBox
            postId={id}
            comments={comments}
            setComments={setComments}
          />
        </div>
      </div>
    </Layout>
  );
}
