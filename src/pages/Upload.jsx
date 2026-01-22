import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";
import { Image, X } from "lucide-react";

export default function Upload() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const mediaType = file?.type.startsWith("video") ? "video" : "image";

  const resetMedia = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const publish = async () => {
    if (!file || uploading) return;

    const form = new FormData();
    form.append("title", title || "Untitled post");
    form.append("media", file);
    form.append("caption", caption);

    try {
      setUploading(true);

      const res = await api.post("/posts", form, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      // ✅ PASS NEW POST TO HOME
      navigate("/", {
        state: {
          newPost: res.data,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="rounded-2xl bg-[#0f1115] border border-white/10 shadow-xl overflow-hidden">

          {/* HEADER */}
          <div className="px-6 py-5 border-b border-white/10">
            <h2 className="text-lg font-semibold">Create post</h2>
            <p className="text-sm text-white/40 mt-1">
              Upload an image or video to share with the community
            </p>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-6">

            {/* MEDIA PICKER */}
            {!preview ? (
              <div
                onClick={() => inputRef.current?.click()}
                className="rounded-xl border border-dashed border-white/20 hover:border-pink-400 transition cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center py-16 text-white/50">
                  <Image size={36} />
                  <p className="mt-4 text-sm font-medium">
                    Click to upload image or video
                  </p>
                  <p className="text-xs mt-1">
                    JPG, PNG, MP4 • Max ~100MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-white/10">
                {mediaType === "image" ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-[380px] object-cover"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="w-full max-h-[380px] object-contain bg-black"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}

                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-black/70">
                  {mediaType.toUpperCase()}
                </span>

                <button
                  type="button"
                  onClick={resetMedia}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-red-500/80 transition"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* FILE INPUT */}
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              hidden
              onChange={(e) => {
                const f = e.target.files[0];
                if (!f) return;
                setFile(f);
                setPreview(URL.createObjectURL(f));
              }}
            />

            {/* TITLE */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write a short title…"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-pink-400 transition"
            />

            {/* CAPTION */}
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add more context to your post…"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-pink-400 transition resize-none"
            />

            {/* PROGRESS */}
            {uploading && (
              <div className="space-y-2">
                <div className="text-xs text-white/50">
                  Uploading… {progress}%
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="px-6 py-5 border-t border-white/10 flex justify-between">
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white/70 hover:bg-white/15 transition"
            >
              Cancel
            </button>

            <button
              onClick={publish}
              disabled={!file || uploading}
              className={`px-6 py-2.5 rounded-xl font-semibold transition
                ${
                  !file || uploading
                    ? "bg-white/10 text-white/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-purple-500 text-white active:scale-95"
                }`}
            >
              {uploading ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
