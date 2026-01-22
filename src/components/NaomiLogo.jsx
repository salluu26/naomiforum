export default function NaomiLogo({ size = "text-4xl" }) {
  return (
    <span
      className={`
        ${size}
        font-extrabold tracking-tight
        bg-gradient-to-r from-pink-500 to-purple-500
        bg-clip-text text-transparent
      `}
    >
      Naomi
    </span>
  );
}
