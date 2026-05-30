import { useEffect, useMemo } from "react";
import useSiteTitle from "./useSiteTitle";
import { replaceSiteTitleDeep, replaceSiteTitleText } from "../services/siteBranding";

function setMetaContent(selector, content) {
  const element = document.querySelector(selector);

  if (element && typeof content === "string") {
    element.setAttribute("content", content);
  }
}

export default function usePageMeta({
  title,
  description = "",
  robots = "index,follow",
  canonical,
  image = "https://imgoraa.com/og-image.svg",
  structuredData = "",
}) {
  const siteTitle = useSiteTitle();
  const nextTitle = useMemo(() => replaceSiteTitleText(title, siteTitle), [siteTitle, title]);
  const nextDescription = useMemo(
    () => replaceSiteTitleText(description, siteTitle),
    [description, siteTitle]
  );
  const nextStructuredData = useMemo(
    () => replaceSiteTitleDeep(structuredData, siteTitle),
    [siteTitle, structuredData]
  );

  useEffect(() => {
    if (nextTitle) {
      document.title = nextTitle;
    }

    setMetaContent('meta[name="description"]', nextDescription);
    setMetaContent('meta[name="robots"]', robots);
    setMetaContent('meta[property="og:title"]', nextTitle || "");
    setMetaContent('meta[property="og:description"]', nextDescription);
    setMetaContent('meta[property="og:url"]', canonical || "");
    setMetaContent('meta[property="og:type"]', "website");
    setMetaContent('meta[property="og:image"]', image);
    setMetaContent('meta[property="og:image:secure_url"]', image);
    setMetaContent('meta[name="twitter:title"]', nextTitle || "");
    setMetaContent('meta[name="twitter:description"]', nextDescription);
    setMetaContent('meta[name="twitter:image"]', image);

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink && canonical) {
      canonicalLink.setAttribute("href", canonical);
    }

    const structuredDataScript = document.getElementById("structured-data");
    if (structuredDataScript) {
      structuredDataScript.textContent =
        typeof nextStructuredData === "string"
          ? nextStructuredData
          : JSON.stringify(nextStructuredData);
    }
  }, [
    canonical,
    image,
    nextDescription,
    nextStructuredData,
    nextTitle,
    robots,
  ]);
}
