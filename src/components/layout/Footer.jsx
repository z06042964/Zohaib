import { Link } from "react-router-dom";
import {
  Camera,
  Globe,
  Mail,
  PlaySquare,
  Send,
  Share2,
  Users,
} from "lucide-react";
import Logo from "../ui/Logo";
import useFooterConfig from "../../hooks/useFooterConfig";
import useSiteTitle from "../../hooks/useSiteTitle";

const SOCIAL_ICON_MAP = {
  share2: Share2,
  globe: Globe,
  mail: Mail,
  facebook: Users,
  instagram: Camera,
  linkedin: Users,
  twitter: Send,
  youtube: PlaySquare,
};

function FooterNavItem({ link }) {
  const className = "text-sm text-slate-400 transition-colors hover:text-white";

  if (link.isRoute) {
    return (
      <Link to={link.href} className={className}>
        {link.label}
      </Link>
    );
  }

  return (
    <a href={link.href} className={className}>
      {link.label}
    </a>
  );
}

export default function Footer() {
  const siteTitle = useSiteTitle();
  const { config } = useFooterConfig();
  const { brandDescription, quickLinks, toolLinks, socialLinks } = config;

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300">
      <div className="section-container py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo variant="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              {brandDescription}
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ id, label, iconKey, href, isRoute }) => {
                const Icon = SOCIAL_ICON_MAP[iconKey] || Globe;
                const className =
                  "flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 transition-all duration-300 hover:bg-brand-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";
                return isRoute ? (
                  <Link
                    key={id}
                    to={href}
                    aria-label={label}
                    className={className}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <a key={id} href={href} aria-label={label} className={className}>
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
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <FooterNavItem link={link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Tools
            </h3>
            <ul className="mt-4 space-y-3">
              {toolLinks.map((link) => (
                <li key={link.id}>
                  <FooterNavItem link={link} />
                </li>
              ))}
            </ul>
          </div>

          <div id="about">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              About
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {siteTitle} is built for designers, marketers, and creators who need
              professional image processing without complex software.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.
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
