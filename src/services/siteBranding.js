export const DEFAULT_SITE_TITLE = "Imgoraa";

export function normalizeSiteTitle(value) {
  const normalized = String(value || "").trim();
  return normalized || DEFAULT_SITE_TITLE;
}

export function replaceSiteTitleText(value, siteTitle = DEFAULT_SITE_TITLE) {
  if (typeof value !== "string") {
    return value;
  }

  const normalizedTitle = normalizeSiteTitle(siteTitle);
  return value.replace(/Imgoraa/g, normalizedTitle);
}

export function replaceSiteTitleDeep(value, siteTitle = DEFAULT_SITE_TITLE) {
  if (typeof value === "string") {
    return replaceSiteTitleText(value, siteTitle);
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceSiteTitleDeep(item, siteTitle));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        replaceSiteTitleDeep(nestedValue, siteTitle),
      ])
    );
  }

  return value;
}
