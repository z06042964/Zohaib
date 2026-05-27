import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const HEADER_CONFIG_REF = doc(db, "siteContent", "header");
const SAVE_TIMEOUT_MS = 12000;

export const DEFAULT_HEADER_CONFIG = {
  adsenseCode: "",
  searchConsoleCode: "",
  customHeadCode: "",
};

function createTimeoutError() {
  const error = new Error(
    "Saving header code to Firestore timed out. Make sure your database exists and rules allow updates to `siteContent/header`."
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

function getFirestoreHeaderError(error) {
  if (error?.code === "permission-denied") {
    return new Error(
      "Firestore denied access to header settings. Update your rules so the public site can read `siteContent/header` and your admin can write it."
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
      "Could not access Firestore header settings. Please verify your database and rules."
  );
}

export function normalizeHeaderConfig(config = {}) {
  return {
    adsenseCode: String(config.adsenseCode || "").trim(),
    searchConsoleCode: String(config.searchConsoleCode || "").trim(),
    customHeadCode: String(config.customHeadCode || "").trim(),
  };
}

export function buildCombinedHeadCode(config = {}) {
  const normalized = normalizeHeaderConfig(config);

  return [normalized.adsenseCode, normalized.searchConsoleCode, normalized.customHeadCode]
    .filter(Boolean)
    .join("\n\n");
}

export async function saveHeaderConfig(config) {
  const normalized = normalizeHeaderConfig(config);

  try {
    await withTimeout(
      setDoc(
        HEADER_CONFIG_REF,
        {
          ...normalized,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    );
  } catch (error) {
    throw getFirestoreHeaderError(error);
  }

  return normalized;
}

export function subscribeToHeaderConfig(onValue, onError) {
  return onSnapshot(
    HEADER_CONFIG_REF,
    (snapshot) => {
      if (!snapshot.exists()) {
        onValue(DEFAULT_HEADER_CONFIG);
        return;
      }

      onValue(normalizeHeaderConfig(snapshot.data()));
    },
    (error) => {
      if (onError) {
        onError(getFirestoreHeaderError(error));
      }
    }
  );
}
