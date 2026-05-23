import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Target,
  Zap,
  Shield,
  Users,
  Sparkles,
} from "lucide-react";
import Button from "../components/ui/Button";
import { TOOLS } from "../constants/tools";

const VALUES = [
  {
    icon: Zap,
    title: "Fast & Simple",
    description:
      "No complicated software. Upload, process, and download in a few clicks.",
  },
  {
    icon: Shield,
    title: "Privacy Focused",
    description:
      "Many tools run in your browser. We only send data to servers when required.",
  },
  {
    icon: Users,
    title: "Built for Creators",
    description:
      "Designed for designers, marketers, and anyone who works with images daily.",
  },
  {
    icon: Target,
    title: "Quality Results",
    description:
      "Modern AI and optimized processing deliver professional output every time.",
  },
];

export default function About() {
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

        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
              About Us
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Making image editing{" "}
              <span className="gradient-text">accessible for everyone</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              PixelCraft AI is a modern image tools platform built to help
              creators, businesses, and everyday users edit images quickly —
              without expensive software or technical skills.
            </p>
          </div>

          <div className="mb-16 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-brand-50 via-white to-violet-50 p-8 shadow-soft sm:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Our mission</h2>
                <p className="mt-4 leading-relaxed text-slate-600">
                  We believe powerful image tools should be free, fast, and easy
                  to use. Our mission is to put professional-grade image
                  processing in everyone&apos;s hands — whether you&apos;re
                  removing a product background, converting file formats, or
                  shrinking images for the web.
                </p>
                <p className="mt-4 leading-relaxed text-slate-600">
                  PixelCraft AI combines smart automation with a clean,
                  intuitive interface so you can focus on creating, not
                  wrestling with complex editors.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-400/20 to-violet-400/20 blur-2xl"
                    aria-hidden="true"
                  />
                  <div className="relative flex h-48 w-48 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-600 to-violet-600 shadow-glow sm:h-56 sm:w-56">
                    <Sparkles
                      className="h-20 w-20 text-white sm:h-24 sm:w-24"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-center text-2xl font-bold text-slate-900">
              What we offer
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
              Three essential tools to handle your everyday image tasks.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {TOOLS.map(
                ({ title, description, icon: Icon, href, iconBg }) => (
                  <Link
                    key={title}
                    to={href}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
                  >
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} transition-transform group-hover:scale-110`}
                    >
                      <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {description}
                    </p>
                    <span className="mt-4 inline-block text-sm font-semibold text-brand-600 group-hover:underline">
                      Try this tool →
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-center text-2xl font-bold text-slate-900">
              Why choose PixelCraft AI
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {VALUES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600">
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-brand-600 via-violet-600 to-purple-700 px-8 py-12 text-center shadow-glow sm:px-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-brand-100">
              Explore our free tools and see how fast image editing can be.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                href="/#tools"
                variant="secondary"
                size="lg"
                className="border-0 bg-white text-brand-700 hover:bg-brand-50"
              >
                Explore Tools
              </Button>
              <Button
                to="/contact"
                variant="secondary"
                size="lg"
                className="border border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
