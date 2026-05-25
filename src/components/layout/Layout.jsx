import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTop from "../ui/BackToTop";
import { DEFAULT_SEO, PAGE_SEO } from "../../seo/pageSeo";

function setMetaContent(selector, content) {
  const element = document.querySelector(selector);

  if (element) {
    element.setAttribute("content", content);
  }
}

export default function Layout() {
  const { pathname, hash } = useLocation();
  const seo = PAGE_SEO[pathname] || DEFAULT_SEO;

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
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
