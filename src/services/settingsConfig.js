import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { DEFAULT_SITE_TITLE, normalizeSiteTitle } from "./siteBranding";

const SETTINGS_CONFIG_REF = doc(db, "siteContent", "settings");
const SAVE_TIMEOUT_MS = 12000;

export const DEFAULT_SETTINGS_CONFIG = {
  maintenanceModeEnabled: false,
  siteTitle: DEFAULT_SITE_TITLE,
};

function createTimeoutError() {
  const error = new Error(
    "Saving settings to Firestore timed out. Make sure your database exists and rules allow updates to `siteContent/settings`."
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

function getFirestoreSettingsError(error) {
  if (error?.code === "permission-denied") {
    return new Error(
      "Firestore denied access to website settings. Update your rules so the public site can read `siteContent/settings` and your admin can write it."
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
      "Could not access Firestore website settings. Please verify your database and rules."
  );
}

export function normalizeSettingsConfig(config = {}) {
  return {
    maintenanceModeEnabled: Boolean(config.maintenanceModeEnabled),
    siteTitle: normalizeSiteTitle(config.siteTitle),
  };
}

export async function saveSettingsConfig(config) {
  const normalized = normalizeSettingsConfig(config);

  try {
    await withTimeout(
      setDoc(
        SETTINGS_CONFIG_REF,
        {
          ...normalized,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    );
  } catch (error) {
    throw getFirestoreSettingsError(error);
  }

  return normalized;
}

export function subscribeToSettingsConfig(onValue, onError) {
  return onSnapshot(
    SETTINGS_CONFIG_REF,
    (snapshot) => {
      if (!snapshot.exists()) {
        onValue(DEFAULT_SETTINGS_CONFIG);
        return;
      }

      onValue(normalizeSettingsConfig(snapshot.data()));
    },
    (error) => {
      if (onError) {
        onError(getFirestoreSettingsError(error));
      }
    }
  );
}
