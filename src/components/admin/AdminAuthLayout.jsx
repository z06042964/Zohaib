import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Sparkles, LockKeyhole } from "lucide-react";
import Logo from "../ui/Logo";
import useSiteTitle from "../../hooks/useSiteTitle";
import { replaceSiteTitleText } from "../../services/siteBranding";

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Secure Firebase auth",
    description: "Email and password access is handled through Firebase Authentication.",
  },
  {
    icon: Sparkles,
    title: "Responsive admin access",
    description: "Optimized for mobile, tablet, laptop, and large desktop screens.",
  },
  {
    icon: LockKeyhole,
    title: "Protected dashboard",
    description: "Only authenticated admins can reach the `/admin` dashboard area.",
  },
];

export default function AdminAuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}) {
  const siteTitle = useSiteTitle();
  const nextSubtitle = replaceSiteTitleText(subtitle, siteTitle);

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-950 to-violet-950" />
          <div
            className="absolute left-16 top-16 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 text-white xl:p-16">
            <div>
              <Logo variant="dark" />
              <div className="mt-16 max-w-xl">
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-100">
                  {siteTitle} Admin
                </span>
                <h1 className="mt-6 text-4xl font-bold leading-tight xl:text-5xl">
                  Manage your admin access with the same clean {siteTitle} look.
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-slate-300">
                  Sign in securely, create new admin accounts, and reach your
                  protected dashboard from a modern responsive interface.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {HIGHLIGHTS.map(({ icon: Icon, title: itemTitle, description }) => (
                <div
                  key={itemTitle}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-200">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white">{itemTitle}</h2>
                      <p className="mt-1 text-sm leading-relaxed text-slate-300">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
              <Logo />
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-soft transition-colors hover:text-brand-600"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="hidden lg:block">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back to website
                </Link>
              </div>

              <div className="mt-2">
                <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                  {eyebrow}
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
                  {nextSubtitle}
                </p>
              </div>

              <div className="mt-8">{children}</div>

              {footer ? <div className="mt-6 text-sm text-slate-500">{footer}</div> : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
