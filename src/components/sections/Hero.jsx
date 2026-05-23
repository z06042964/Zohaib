import { ArrowRight, Play } from "lucide-react";
import Button from "../ui/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32">
      <div
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-400/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="section-container relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-slide-up text-center lg:text-left">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold text-brand-700 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
              </span>
              AI-Powered Image Tools
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Powerful AI Image Tools for{" "}
              <span className="gradient-text">Creators</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
              Remove backgrounds, compress images, and convert files instantly
              with our fast and modern AI-powered tools.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button href="/#tools" size="lg">
                Explore Tools
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button href="/#how-it-works" variant="secondary" size="lg">
                <Play className="h-4 w-4" aria-hidden="true" />
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative animate-fade-in lg:pl-8">
            <div className="relative mx-auto max-w-lg">
              <div
                className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-500/20 via-violet-500/20 to-purple-500/20 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/40 p-2 shadow-glow backdrop-blur-xl">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
                  <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 shadow-lg shadow-brand-500/30">
                      <svg
                        className="h-10 w-10 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                      Hero illustration placeholder
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Replace with your product screenshot
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-4 top-8 animate-float rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-card backdrop-blur-sm">
                <p className="text-xs font-medium text-slate-500">Processing</p>
                <p className="text-sm font-bold text-brand-600">Background removed ✓</p>
              </div>

              <div
                className="absolute -right-2 bottom-12 animate-float rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-card backdrop-blur-sm"
                style={{ animationDelay: "1.5s" }}
              >
                <p className="text-xs font-medium text-slate-500">Saved</p>
                <p className="text-sm font-bold text-emerald-600">68% smaller file</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
