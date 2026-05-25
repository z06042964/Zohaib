import { Link } from "react-router-dom";
import BrandMark from "./BrandMark";

export default function Logo({ variant = "default" }) {
  const isDark = variant === "dark";

  return (
    <Link
      to="/"
      className="group inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-lg"
      aria-label="Imgoraa - Home"
    >
      <BrandMark
        className={`h-9 w-9 shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          isDark ? "drop-shadow-sm" : "drop-shadow-lg"
        }`}
      />
      <span
        className={`text-lg font-bold tracking-tight ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        Img<span className="gradient-text">oraa</span>
      </span>
    </Link>
  );
}
