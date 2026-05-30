import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import NavLink from "./NavLink";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import useNavbarLinks from "../../hooks/useNavbarLinks";

const linkClass =
  "text-sm font-medium text-slate-600 transition-colors hover:text-brand-600";

const mobileLinkClass =
  "block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-600";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrollPosition();
  const { links } = useNavbarLinks();

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav-scrolled" : "glass-nav"
      }`}
    >
      <nav
        className="section-container flex h-16 items-center justify-between lg:h-[4.5rem]"
        aria-label="Main navigation"
      >
        <Logo />

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.id || `${link.label}-${link.href}`}>
              <NavLink {...link} className={linkClass} />
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button href="/#tools" size="sm">
            Get Started
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      <div
        className={`overflow-hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <ul className="section-container flex flex-col gap-1 py-4">
          {links.map((link) => (
            <li key={link.id || `${link.label}-${link.href}`}>
              <NavLink
                {...link}
                className={mobileLinkClass}
                onClick={closeMobile}
              />
            </li>
          ))}
          <li className="pt-2">
            <Button href="/#tools" size="sm" className="w-full" onClick={closeMobile}>
              Get Started
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}
