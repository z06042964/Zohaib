import { Link } from "react-router-dom";
import { GitBranch, Share2, Globe, Mail } from "lucide-react";
import Logo from "../ui/Logo";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Tools", href: "/#tools" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];

const TOOL_LINKS = [
  { label: "Background Remover", href: "/background-remover" },
  { label: "PNG to JPG", href: "/png-to-jpg" },
  { label: "Image Compressor", href: "/image-compressor" },
];

const SOCIAL = [
  { label: "Share", icon: Share2, href: "#" },
  { label: "GitHub", icon: GitBranch, href: "#" },
  { label: "Website", icon: Globe, href: "#" },
  { label: "Email", icon: Mail, href: "/contact" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300">
      <div className="section-container py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo variant="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Powerful AI image tools for creators. Remove backgrounds, convert
              formats, and compress images — fast and free.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL.map(({ label, icon: Icon, href }) => {
                const className =
                  "flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 transition-all duration-300 hover:bg-brand-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";
                return href === "/contact" ? (
                  <Link
                    key={label}
                    to={href}
                    aria-label={label}
                    className={className}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <a key={label} href={href} aria-label={label} className={className}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Tools
            </h3>
            <ul className="mt-4 space-y-3">
              {TOOL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div id="about">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              About
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Imgoraa is built for designers, marketers, and creators who need
              professional image processing without complex software.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Imgoraa. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
