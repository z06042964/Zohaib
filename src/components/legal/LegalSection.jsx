export default function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-3 space-y-3 text-slate-600 leading-relaxed">{children}</div>
    </section>
  );
}
