export default function FormatSelector({
  formats,
  value,
  onChange,
  disabled = false,
  columns = 3,
}) {
  const gridClass =
    columns === 4
      ? "grid grid-cols-2 gap-3 sm:grid-cols-4"
      : "grid grid-cols-3 gap-3";

  return (
    <div className={gridClass}>
      {formats.map((format) => {
        const isActive = value === format.id;
        return (
          <button
            key={format.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(format.id)}
            className={`rounded-xl border-2 px-4 py-3 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              isActive
                ? "border-brand-500 bg-brand-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50"
            }`}
            aria-pressed={isActive}
          >
            <span
              className={`block text-sm font-bold ${
                isActive ? "text-brand-700" : "text-slate-900"
              }`}
            >
              {format.label}
            </span>
            <span className="mt-1 block text-xs text-slate-500">
              .{format.extension}
            </span>
          </button>
        );
      })}
    </div>
  );
}
