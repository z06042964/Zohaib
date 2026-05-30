export default function FeatureCard({ title, description, icon: Icon }) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft transition-all duration-300 hover:border-brand-200 hover:shadow-card">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {description}
      </p>
    </div>
  );
}
