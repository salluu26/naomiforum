export default function AgePicker({ value = 18, onChange }) {
  const age = Math.max(18, value || 18);

  return (
    <div>
      <label className="text-white/40 text-sm mb-2 block">Age</label>
      <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
        <button
          onClick={() => onChange(Math.max(18, age - 1))}
          className="w-8 h-8 rounded-full bg-white/10"
        >
          −
        </button>

        <span className="text-lg font-medium">{age}</span>

        <button
          onClick={() => onChange(age + 1)}
          className="w-8 h-8 rounded-full bg-white/10"
        >
          +
        </button>
      </div>
      <p className="text-xs text-white/30 mt-1">18+ only</p>
    </div>
  );
}
