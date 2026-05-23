import { ArrowRight } from "lucide-react";
import Button from "./Button";

export default function ToolCard({
  title,
  description,
  icon: Icon,
  href,
  gradient,
  iconBg,
}) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card sm:p-8">
      <div
        className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        aria-hidden="true"
      />

      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
      </div>

      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-3 flex-grow text-slate-600 leading-relaxed">
        {description}
      </p>

      <div className="relative z-10 mt-6">
        <Button
          to={href}
          variant="secondary"
          size="sm"
          className="group/btn w-full sm:w-auto"
        >
          Use Tool
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
            aria-hidden="true"
          />
        </Button>
      </div>
    </article>
  );
}
