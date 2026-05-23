import { Link } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import Button from "../components/ui/Button";

export default function ToolPlaceholder({ title, description }) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 pt-24 pb-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
          <Construction className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">{description}</p>
        <p className="mt-2 text-sm text-slate-500">This tool page is coming soon.</p>
        <div className="mt-8">
          <Button to="/" variant="secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </Button>
        </div>
        <p className="mt-6 text-sm text-slate-400">
          Or explore other tools on the{" "}
          <Link to="/#tools" className="font-medium text-brand-600 hover:underline">
            homepage
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
