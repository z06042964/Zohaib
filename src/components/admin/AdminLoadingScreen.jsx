import { Loader2 } from "lucide-react";

export default function AdminLoadingScreen({ label = "Loading admin..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 px-6 text-white">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
        <Loader2 className="h-5 w-5 animate-spin text-brand-300" aria-hidden="true" />
        <span className="text-sm font-medium text-slate-100">{label}</span>
      </div>
    </div>
  );
}
