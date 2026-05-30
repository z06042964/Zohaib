import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const ADS_CONFIG_REF = doc(db, "siteContent", "ads");
const SAVE_TIMEOUT_MS = 12000;

export const DEFAULT_ADS_CONFIG = {
  headerAdCode: "",
  routeAdCode: "",
  homeAdCode: "",
  toolPagesAdCode: "",
  footerAdCode: "",
};

function createTimeoutError() {
  const error = new Error(
    "Saving ads settings to Firestore timed out. Make sure your database exists and rules allow updates to `siteContent/ads`."
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

function getFirestoreAdsError(error) {
  if (error?.code === "permission-denied") {
    return new Error(
      "Firestore denied access to ads settings. Update your rules so the public site can read `siteContent/ads` and your admin can write it."
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
      "Could not access Firestore ads settings. Please verify your database and rules."
  );
}

export function normalizeAdsConfig(config = {}) {
  return {
    headerAdCode: String(config.headerAdCode || "").trim(),
    routeAdCode: String(config.routeAdCode || "").trim(),
    homeAdCode: String(config.homeAdCode || "").trim(),
    toolPagesAdCode: String(config.toolPagesAdCode || "").trim(),
    footerAdCode: String(config.footerAdCode || "").trim(),
  };
}

export async function saveAdsConfig(config) {
  const normalized = normalizeAdsConfig(config);

  try {
    await withTimeout(
      setDoc(
        ADS_CONFIG_REF,
        {
          ...normalized,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    );
  } catch (error) {
    throw getFirestoreAdsError(error);
  }

  return normalized;
}

export function subscribeToAdsConfig(onValue, onError) {
  return onSnapshot(
    ADS_CONFIG_REF,
    (snapshot) => {
      if (!snapshot.exists()) {
        onValue(DEFAULT_ADS_CONFIG);
        return;
      }

      onValue(normalizeAdsConfig(snapshot.data()));
    },
    (error) => {
      if (onError) {
        onError(getFirestoreAdsError(error));
      }
    }
  );
}
