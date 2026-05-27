import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTop from "../ui/BackToTop";
import ManagedAdSlot from "../ads/ManagedAdSlot";
import useAdsConfig from "../../hooks/useAdsConfig";
import useHeaderCode from "../../hooks/useHeaderCode";
import useInjectHeadCode from "../../hooks/useInjectHeadCode";
import useSiteTitle from "../../hooks/useSiteTitle";
import { DEFAULT_SEO, PAGE_SEO } from "../../seo/pageSeo";
import { buildCombinedHeadCode } from "../../services/headerConfig";
import { replaceSiteTitleDeep } from "../../services/siteBranding";

const TOOL_PAGE_PATHS = new Set([
  "/background-remover",
  "/image-compressor",
  "/png-to-jpg",
]);

function setMetaContent(selector, content) {
  const element = document.querySelector(selector);

  if (element) {
    element.setAttribute("content", content);
  }
}

export default function Layout() {
  const { pathname, hash } = useLocation();
  const siteTitle = useSiteTitle();
  const seo = useMemo(
    () => replaceSiteTitleDeep(PAGE_SEO[pathname] || DEFAULT_SEO, siteTitle),
    [pathname, siteTitle]
  );
  const { config: adsConfig } = useAdsConfig();
  const { config: headerConfig } = useHeaderCode();
  const combinedHeadCode = buildCombinedHeadCode(headerConfig);
  const isHomePage = pathname === "/";
  const isToolPage = TOOL_PAGE_PATHS.has(pathname);

  useInjectHeadCode(combinedHeadCode);

  useEffect(() => {
    document.title = seo.title;
    setMetaContent('meta[name="description"]', seo.description);
    setMetaContent('meta[name="keywords"]', seo.keywords);
    setMetaContent('meta[name="robots"]', seo.robots);
    setMetaContent('meta[property="og:title"]', seo.title);
    setMetaContent('meta[property="og:description"]', seo.description);
    setMetaContent('meta[property="og:url"]', seo.url);
    setMetaContent('meta[property="og:type"]', seo.ogType);
    setMetaContent('meta[property="og:image"]', seo.image);
    setMetaContent('meta[property="og:image:secure_url"]', seo.image);
    setMetaContent('meta[property="og:image:alt"]', `${seo.title} preview image`);
    setMetaContent('meta[name="twitter:title"]', seo.title);
    setMetaContent('meta[name="twitter:description"]', seo.description);
    setMetaContent('meta[name="twitter:image"]', seo.image);

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", seo.url);
    }

    const structuredData = document.getElementById("structured-data");
    if (structuredData) {
      structuredData.textContent = JSON.stringify(seo.schema);
    }
  }, [seo]);

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ManagedAdSlot code={adsConfig.headerAdCode} className="section-container pt-4" />
      <div className="flex-grow">
        <ManagedAdSlot code={adsConfig.routeAdCode} className="section-container pt-4" />
        {isHomePage ? (
          <ManagedAdSlot code={adsConfig.homeAdCode} className="section-container pt-4" />
        ) : null}
        {isToolPage ? (
          <ManagedAdSlot
            code={adsConfig.toolPagesAdCode}
            className="section-container pt-4"
          />
        ) : null}
        <Outlet />
      </div>
      <ManagedAdSlot code={adsConfig.footerAdCode} className="section-container pb-4" />
      <Footer />
      <BackToTop />
    </div>
  );
}
