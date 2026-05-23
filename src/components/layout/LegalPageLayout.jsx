import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function LegalPageLayout({ title, lastUpdated, children }) {
  return (
    <main className="pt-24 pb-16 sm:pt-28 sm:pb-24">
      <div className="section-container">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Home
        </Link>

        <div className="mx-auto max-w-3xl">
          <header className="mb-10 border-b border-slate-200 pb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>
            {lastUpdated && (
              <p className="mt-3 text-sm text-slate-500">
                Last updated: {lastUpdated}
              </p>
            )}
          </header>

          <article className="prose-legal space-y-8 text-slate-600 leading-relaxed">
            {children}
          </article>
        </div>
      </div>
    </main>
  );
}
