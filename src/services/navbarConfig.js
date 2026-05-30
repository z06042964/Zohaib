import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { DEFAULT_NAV_LINKS } from "../constants/navigation";
import { db } from "../lib/firebase";

const NAVBAR_CONFIG_REF = doc(db, "siteContent", "navbar");
const SAVE_TIMEOUT_MS = 12000;

function createId(prefix = "nav") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createTimeoutError() {
  const error = new Error(
    "Saving to Firestore timed out. Make sure Firestore Database exists and your rules allow writes to `siteContent/navbar`."
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

function getFirestoreNavbarError(error) {
  if (error?.code === "permission-denied") {
    return new Error(
      "Firestore denied this update. Update your Firestore rules so your admin account can write to `siteContent/navbar`."
    );
  }

  if (error?.code === "failed-precondition") {
    return new Error(
      "Firestore Database is not created yet. Create a Firestore Database in the Firebase console first."
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
      "Could not save navbar links to Firestore. Please verify your database and rules."
  );
}

export function normalizeNavbarLinks(links = []) {
  return links.map((link, index) => ({
    id: link.id || createId(),
    label: String(link.label || "").trim() || `Link ${index + 1}`,
    href: String(link.href || "").trim() || "/",
    isRoute: Boolean(link.isRoute),
    order: index,
  }));
}

export async function saveNavbarLinks(links) {
  const normalizedLinks = normalizeNavbarLinks(links);

  try {
    await withTimeout(
      setDoc(
        NAVBAR_CONFIG_REF,
        {
          items: normalizedLinks,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    );
  } catch (error) {
    throw getFirestoreNavbarError(error);
  }

  return normalizedLinks;
}

export function subscribeToNavbarLinks(onValue, onError) {
  return onSnapshot(
    NAVBAR_CONFIG_REF,
    (snapshot) => {
      if (!snapshot.exists()) {
        const defaults = normalizeNavbarLinks(DEFAULT_NAV_LINKS);
        onValue(defaults);
        return;
      }

      const items = Array.isArray(snapshot.data()?.items)
        ? snapshot
            .data()
            .items.slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : DEFAULT_NAV_LINKS;

      onValue(normalizeNavbarLinks(items));
    },
    (error) => {
      if (onError) {
        onError(getFirestoreNavbarError(error));
      }
    }
  );
}

export function createEmptyNavbarLink() {
  return {
    id: createId(),
    label: "",
    href: "",
    isRoute: true,
  };
}
