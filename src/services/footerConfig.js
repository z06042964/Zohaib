import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const FOOTER_CONFIG_REF = doc(db, "siteContent", "footer");
const SAVE_TIMEOUT_MS = 12000;
const REQUIRED_QUICK_LINKS = [
  {
    id: "footer-sitemap",
    label: "Sitemap XML",
    href: "/sitemap.xml",
    isRoute: false,
  },
  {
    id: "footer-robots",
    label: "Robots TXT",
    href: "/robots.txt",
    isRoute: false,
  },
];

export const DEFAULT_FOOTER_CONFIG = {
  brandDescription:
    "Powerful AI image tools for creators. Remove backgrounds, convert formats, and compress images - fast and free.",
  quickLinks: [
    { id: "footer-home", label: "Home", href: "/", isRoute: true, order: 0 },
    { id: "footer-about", label: "About", href: "/about", isRoute: true, order: 1 },
    { id: "footer-tools", label: "Tools", href: "/#tools", isRoute: false, order: 2 },
    { id: "footer-how", label: "How It Works", href: "/#how-it-works", isRoute: false, order: 3 },
    { id: "footer-faq", label: "FAQ", href: "/#faq", isRoute: false, order: 4 },
    { id: "footer-contact", label: "Contact", href: "/contact", isRoute: true, order: 5 },
    {
      id: "footer-sitemap",
      label: "Sitemap XML",
      href: "/sitemap.xml",
      isRoute: false,
      order: 6,
    },
    {
      id: "footer-robots",
      label: "Robots TXT",
      href: "/robots.txt",
      isRoute: false,
      order: 7,
    },
  ],
  toolLinks: [
    {
      id: "footer-bg-remover",
      label: "Background Remover",
      href: "/background-remover",
      isRoute: true,
      order: 0,
    },
    {
      id: "footer-png-to-jpg",
      label: "PNG to JPG",
      href: "/png-to-jpg",
      isRoute: true,
      order: 1,
    },
    {
      id: "footer-compressor",
      label: "Image Compressor",
      href: "/image-compressor",
      isRoute: true,
      order: 2,
    },
  ],
  socialLinks: [
    { id: "footer-social-share", label: "Share", href: "#", isRoute: false, iconKey: "share2", order: 0 },
    { id: "footer-social-website", label: "Website", href: "/", isRoute: true, iconKey: "globe", order: 1 },
    { id: "footer-social-email", label: "Email", href: "/contact", isRoute: true, iconKey: "mail", order: 2 },
  ],
};

function createId(prefix = "footer") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createTimeoutError() {
  const error = new Error(
    "Saving footer settings to Firestore timed out. Make sure your database exists and rules allow updates to `siteContent/footer`."
  );
  error.code = "timeout";
  return error;
}

function withTimeout(promise, timeoutMs = SAVE_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(createTimeoutError()), timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

function getFirestoreFooterError(error) {
  if (error?.code === "permission-denied") {
    return new Error(
      "Firestore denied access to footer settings. Update your rules so the public site can read `siteContent/footer` and your admin can write it."
    );
  }

  if (error?.code === "failed-precondition") {
    return new Error(
      "Firestore Database is not created yet. Create a Firestore Database in Firebase first."
    );
  }

  if (error?.code === "unavailable") {
    return new Error(
      "Firestore is currently unavailable. Check your internet connection and Firebase project status."
    );
  }

  if (error?.code === "timeout") {
    return error;
  }

  return new Error(
    error?.message ||
      "Could not access Firestore footer settings. Please verify your database and rules."
  );
}

function normalizeLinkList(links = [], prefix) {
  return links.map((link, index) => ({
    id: link.id || createId(prefix),
    label: String(link.label || "").trim() || `Link ${index + 1}`,
    href: String(link.href || "").trim() || "/",
    isRoute: Boolean(link.isRoute),
    order: index,
  }));
}

function normalizeSocialLinks(links = []) {
  return links.map((link, index) => ({
    id: link.id || createId("social"),
    label: String(link.label || "").trim() || `Social ${index + 1}`,
    href: String(link.href || "").trim() || "#",
    isRoute: Boolean(link.isRoute),
    iconKey: String(link.iconKey || "globe").trim() || "globe",
    order: index,
  }));
}

function ensureRequiredQuickLinks(links = []) {
  const existingHrefs = new Set(
    links.map((link) => String(link.href || "").trim().toLowerCase()).filter(Boolean)
  );

  return [
    ...links,
    ...REQUIRED_QUICK_LINKS.filter(
      (link) => !existingHrefs.has(link.href.toLowerCase())
    ),
  ];
}

export function normalizeFooterConfig(config = {}) {
  const quickLinksSource = Array.isArray(config.quickLinks)
    ? ensureRequiredQuickLinks(config.quickLinks)
    : DEFAULT_FOOTER_CONFIG.quickLinks;

  return {
    brandDescription:
      String(config.brandDescription || "").trim() ||
      DEFAULT_FOOTER_CONFIG.brandDescription,
    quickLinks: normalizeLinkList(
      quickLinksSource,
      "quick-link"
    ),
    toolLinks: normalizeLinkList(
      Array.isArray(config.toolLinks) ? config.toolLinks : DEFAULT_FOOTER_CONFIG.toolLinks,
      "tool-link"
    ),
    socialLinks: normalizeSocialLinks(
      Array.isArray(config.socialLinks)
        ? config.socialLinks
        : DEFAULT_FOOTER_CONFIG.socialLinks
    ),
  };
}

export async function saveFooterConfig(config) {
  const normalized = normalizeFooterConfig(config);

  try {
    await withTimeout(
      setDoc(
        FOOTER_CONFIG_REF,
        {
          ...normalized,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    );
  } catch (error) {
    throw getFirestoreFooterError(error);
  }

  return normalized;
}

export function subscribeToFooterConfig(onValue, onError) {
  return onSnapshot(
    FOOTER_CONFIG_REF,
    (snapshot) => {
      if (!snapshot.exists()) {
        onValue(DEFAULT_FOOTER_CONFIG);
        return;
      }

      onValue(normalizeFooterConfig(snapshot.data()));
    },
    (error) => {
      if (onError) {
        onError(getFirestoreFooterError(error));
      }
    }
  );
}

export function createEmptyFooterLink() {
  return {
    id: createId("footer-link"),
    label: "",
    href: "",
    isRoute: true,
  };
}

export function createEmptySocialLink() {
  return {
    id: createId("social-link"),
    label: "",
    href: "",
    isRoute: false,
    iconKey: "globe",
  };
}
