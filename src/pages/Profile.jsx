import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import AvatarCropModal from "../components/AvatarCropModal";
import { Eye, User, FileText, ChevronDown, Loader2 } from "lucide-react";
import PrivacyToggle from "../components/PrivacyToggle";

const SEX_OPTIONS = [
  { label: "Prefer not to say", value: "" },
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Trans", value: "trans" },
  { label: "Non-binary", value: "non-binary" },
  { label: "Other", value: "other" },
];

export default function Profile() {
  // DB state
  const [original, setOriginal] = useState(null);
  const [draft, setDraft] = useState(null);

  // UI state
  const [file, setFile] = useState(null);
  const [sexOpen, setSexOpen] = useState(false);
  const [status, setStatus] = useState(null); // success | error | null
  const [saving, setSaving] = useState(false);

  const fileRef = useRef();

  /* FETCH PROFILE */
  useEffect(() => {
    api.get("/users/me").then((res) => {
      setOriginal(res.data);
      setDraft(res.data);
    });
  }, []);

  if (!draft) return <Layout />;

  /* SAVE PROFILE */
  const save = async () => {
    if (saving) return;

    try {
      setSaving(true);
      setStatus(null);

      const form = new FormData();
      form.append("username", draft.username);
      form.append("age", draft.age);
      form.append("sex", draft.sex || "");
      form.append("bio", draft.bio || "");
      form.append("showAge", draft.showAge);
      form.append("showSex", draft.showSex);
      form.append("showBio", draft.showBio);

      if (draft.avatarBlob) {
        form.append("avatar", draft.avatarBlob);
      }

      const res = await api.put("/users/me", form);

      // 🔥 THIS IS THE FIX
      localStorage.setItem("user", JSON.stringify(res.data));

      setOriginal(res.data);
      setDraft(res.data);
      setStatus("success");

    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  /* DELETE ACCOUNT */
  const deleteAccount = async () => {
    if (!window.confirm("Delete account permanently?")) return;
    await api.delete("/users/me");
    localStorage.clear();
    window.location.href = "/register";
  };

  const hasUnsavedChanges =
    JSON.stringify(original) !== JSON.stringify(draft);

  const selectedSex =
    SEX_OPTIONS.find((o) => o.value === draft.sex)?.label ||
    "Prefer not to say";

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 py-10 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col items-center gap-4">
          <div
            onClick={() => fileRef.current.click()}
            className="relative group cursor-pointer"
          >
            <img
              src={draft.avatar || "/avatar.png"}
              alt={`${draft.username}'s avatar`}
              className="w-24 h-24 rounded-full object-cover border border-white/10"
            />
            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm transition">
              Change
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <input
            value={draft.username}
            onChange={(e) =>
              setDraft({ ...draft, username: e.target.value })
            }
            className="bg-transparent text-center text-lg font-semibold outline-none border-b border-white/10 focus:border-pink-400"
          />

          {hasUnsavedChanges && (
            <span className="text-xs text-pink-400">
              Changes not saved
            </span>
          )}
        </div>

        {/* BASIC INFO */}
        <section className="glass-card space-y-5 overflow-visible">
          <h3 className="section-title">Basic information</h3>

          {/* AGE */}
          <div>
            <label className="label">Age (18+)</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setDraft({ ...draft, age: Math.max(18, draft.age - 1) })
                }
                className="icon-btn"
              >
                −
              </button>
              <div className="w-16 text-center font-medium">
                {draft.age}
              </div>
              <button
                onClick={() =>
                  setDraft({ ...draft, age: draft.age + 1 })
                }
                className="icon-btn"
              >
                +
              </button>
            </div>
          </div>

          {/* SEX */}
          <div className="space-y-2">
            <label className="label">Sex</label>

            <button
              type="button"
              onClick={() => setSexOpen(!sexOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 border border-white/10"
            >
              <span className="text-sm">{selectedSex}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${sexOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`transition-all duration-300 overflow-hidden ${sexOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              <div className="mt-2 rounded-xl bg-[#15151b] border border-white/10 divide-y divide-white/5 max-h-64 overflow-y-auto pb-1">
                {SEX_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      setDraft({ ...draft, sex: opt.value });
                      setSexOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition ${draft.sex === opt.value
                      ? "text-pink-400 bg-pink-500/10"
                      : "text-white/80 hover:bg-white/5"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BIO */}
        <section className="glass-card space-y-3">
          <h3 className="section-title">Bio</h3>
          <textarea
            rows={4}
            value={draft.bio || ""}
            onChange={(e) =>
              setDraft({ ...draft, bio: e.target.value })
            }
            placeholder="Say something about yourself…"
            className="textarea"
          />
        </section>

        {/* VISIBILITY */}
        <section className="glass-card space-y-2">
          <h3 className="section-title">Visibility</h3>

          <PrivacyToggle
            icon={Eye}
            label="Show age"
            checked={draft.showAge}
            onChange={(v) => setDraft({ ...draft, showAge: v })}
          />
          <PrivacyToggle
            icon={User}
            label="Show sex"
            checked={draft.showSex}
            onChange={(v) => setDraft({ ...draft, showSex: v })}
          />
          <PrivacyToggle
            icon={FileText}
            label="Show bio"
            checked={draft.showBio}
            onChange={(v) => setDraft({ ...draft, showBio: v })}
          />
        </section>

        {/* ACCOUNT */}
        <section className="glass-card border-red-500/30">
          <h3 className="section-title text-red-400">Account</h3>
          <p className="text-sm text-white/50 mb-3">
            This action is permanent and cannot be undone.
          </p>
          <button
            onClick={deleteAccount}
            className="text-red-400 hover:underline text-sm"
          >
            Delete account permanently
          </button>
        </section>

        {/* STATUS */}
        {status === "success" && (
          <div className="glass-card text-green-400 text-sm text-center">
            ✅ Profile updated successfully
          </div>
        )}

        {status === "error" && (
          <div className="glass-card text-red-400 text-sm text-center">
            ❌ Failed to update profile
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end items-center gap-3 pt-4">
          <button
            onClick={() => setDraft(original)}
            className="btn-danger"
            disabled={saving}
          >
            Discard
          </button>

          <button
            onClick={save}
            className="btn-primary flex items-center gap-2"
            disabled={saving}
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {file && (
        <AvatarCropModal
          file={file}
          onClose={() => setFile(null)}
          onSave={(blob) => {
            setDraft({
              ...draft,
              avatar: URL.createObjectURL(blob),
              avatarBlob: blob,
            });
            setFile(null);
          }}
        />
      )}
    </Layout>
  );
}
