import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Logo({ variant = "default" }) {
  const isDark = variant === "dark";

  return (
    <Link
      to="/"
      className="group inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-lg"
      aria-label="PixelCraft AI - Home"
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 shadow-lg shadow-brand-500/25 transition-transform duration-300 group-hover:scale-105 ${
          isDark ? "shadow-brand-500/10" : ""
        }`}
      >
        <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
      </div>
      <span
        className={`text-lg font-bold tracking-tight ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        Pixel<span className="gradient-text">Craft</span>
      </span>
    </Link>
  );
}
