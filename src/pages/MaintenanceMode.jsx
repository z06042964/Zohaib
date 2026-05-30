import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";
import usePageMeta from "../hooks/usePageMeta";
import useSiteTitle from "../hooks/useSiteTitle";

export default function MaintenanceMode() {
  const siteTitle = useSiteTitle();

  usePageMeta({
    title: "Maintenance Mode | Imgoraa",
    description:
      "Imgoraa is temporarily under maintenance. Please check back soon.",
    robots: "noindex,nofollow",
    canonical: "https://imgoraa.com/",
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 px-6 py-12 text-white">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/10 p-8 shadow-glow backdrop-blur-xl sm:p-10">
        <Logo variant="dark" />

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-brand-200">
          Website Maintenance
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          We are improving {siteTitle} right now
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
          Our website is temporarily in maintenance mode. Please come back after
          some time. Once the admin turns maintenance mode off, the public website
          will be available again.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/admin/login">Admin Login</Button>
          <Button
            href="mailto:support@imgoraa.com"
            variant="secondary"
            className="border-white/20 bg-white/10 text-white hover:border-white/30 hover:bg-white/15 hover:text-white"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </main>
  );
}
