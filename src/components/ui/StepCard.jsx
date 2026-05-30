export default function StepCard({ step, title, description, icon: Icon }) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="relative mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-lg shadow-brand-500/30">
          <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-600 shadow-md ring-2 ring-brand-100">
          {step}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
        {description}
      </p>
    </div>
  );
}
