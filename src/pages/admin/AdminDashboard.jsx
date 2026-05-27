import { useMemo, useState } from "react";
import {
  BadgeHelp,
  LayoutPanelTop,
  LogOut,
  Mail,
  MonitorCog,
  PanelsTopLeft,
  Settings,
  SquareTerminal,
} from "lucide-react";
import Logo from "../../components/ui/Logo";
import Button from "../../components/ui/Button";
import AdsManagementPanel from "../../components/admin/AdsManagementPanel";
import FooterManagementPanel from "../../components/admin/FooterManagementPanel";
import HeaderManagementPanel from "../../components/admin/HeaderManagementPanel";
import NavbarManagementPanel from "../../components/admin/NavbarManagementPanel";
import SettingsManagementPanel from "../../components/admin/SettingsManagementPanel";
import { useAuth } from "../../context/AuthContext";
import usePageMeta from "../../hooks/usePageMeta";
import useSiteTitle from "../../hooks/useSiteTitle";

const ADMIN_SECTIONS = [
  {
    id: "navbar",
    label: "Nav bar management",
    description: "Manage live navbar links from Firebase.",
    icon: PanelsTopLeft,
  },
  {
    id: "header",
    label: "Header management",
    description: "Header controls and branding settings.",
    icon: LayoutPanelTop,
  },
  {
    id: "footer",
    label: "Footer management",
    description: "Footer links and copyright options.",
    icon: MonitorCog,
  },
  {
    id: "ads",
    label: "Ads management",
    description: "Configure ad placements and slots.",
    icon: SquareTerminal,
  },
  {
    id: "settings",
    label: "Settings",
    description: "General admin and site preferences.",
    icon: Settings,
  },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const siteTitle = useSiteTitle();
  const [activeSection, setActiveSection] = useState("navbar");

  usePageMeta({
    title: "Admin Dashboard | Imgoraa",
    description: "Protected admin dashboard for Imgoraa.",
    robots: "noindex,nofollow",
    canonical: "https://imgoraa.com/admin",
  });

  const activeSectionConfig = useMemo(
    () => ADMIN_SECTIONS.find((section) => section.id === activeSection) || ADMIN_SECTIONS[0],
    [activeSection]
  );

  const renderActivePanel = () => {
    if (activeSection === "navbar") {
      return <NavbarManagementPanel />;
    }

    if (activeSection === "header") {
      return <HeaderManagementPanel />;
    }

    if (activeSection === "footer") {
      return <FooterManagementPanel />;
    }

    if (activeSection === "ads") {
      return <AdsManagementPanel />;
    }

    if (activeSection === "settings") {
      return <SettingsManagementPanel />;
    }

    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <BadgeHelp className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
              {activeSectionConfig.label}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              This section is ready for the next step
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              The admin shell is ready for `{activeSectionConfig.label}`. I have
              fully implemented `Nav bar management` first, and these remaining
              sections can be connected to Firebase in the same right-side area next.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="section-container flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Logo variant="dark" />

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">
              <Mail className="h-4 w-4 text-brand-300" aria-hidden="true" />
              {user?.email}
            </span>
            <Button
              variant="secondary"
              className="border-0 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <section className="section-container py-10 sm:py-14">
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-brand-950 via-slate-900 to-violet-950 p-6 shadow-glow sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-200">
            {siteTitle} Admin
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome, {user?.displayName || "Admin"}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            The admin panel now follows a split layout: around 30% left sidebar
            for management options and around 70% right content area for the
            selected section.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(280px,30%)_minmax(0,70%)]">
          <aside className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5">
            <div className="mb-4 border-b border-slate-100 px-2 pb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
                Main options
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Select an option from the left. Its management panel opens on the right.
              </p>
            </div>

            <nav className="space-y-2" aria-label="Admin management sections">
              {ADMIN_SECTIONS.map(({ id, label, description, icon: Icon }) => {
                const isActive = activeSection === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveSection(id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${
                      isActive
                        ? "border-brand-200 bg-brand-50 shadow-soft"
                        : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                          isActive
                            ? "bg-brand-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`font-semibold ${
                            isActive ? "text-brand-700" : "text-slate-900"
                          }`}
                        >
                          {label}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-500">
                          {description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0">{renderActivePanel()}</div>
        </div>
      </section>
    </main>
  );
}
