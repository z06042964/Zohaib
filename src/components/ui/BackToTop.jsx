import { ArrowUp } from "lucide-react";
import { useScrollPosition } from "../../hooks/useScrollPosition";

export default function BackToTop({ threshold = 400 }) {
  const visible = useScrollPosition(threshold);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-lg shadow-brand-500/30 transition-all duration-300 hover:scale-110 hover:shadow-brand-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:bottom-8 sm:right-8 ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}
