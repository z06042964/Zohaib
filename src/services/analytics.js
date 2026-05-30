import {
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const SESSION_STORAGE_KEY = "imgoraa_analytics_session";
const SESSION_DURATION_MS = 30 * 60 * 1000;
const LIVE_SESSION_TTL_MS = 5 * 60 * 1000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function pad(value) {
  return String(value).padStart(2, "0");
}

export function formatDateKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function formatHourKey(date = new Date()) {
  return `${formatDateKey(date)}-${pad(date.getUTCHours())}`;
}

export function getOrCreateSessionId() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.id && parsed.expiresAt > Date.now()) {
        return parsed.id;
      }
    }
  } catch {
    // Ignore malformed session storage.
  }

  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  sessionStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({
      id,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    })
  );

  return id;
}

function getFirestoreAnalyticsError(error) {
  if (error?.code === "permission-denied") {
    return new Error(
      "Firestore denied analytics access. Publish rules for `analyticsDaily`, `analyticsHourly`, and `analyticsLive`, and sign in as admin@imgoraa.com to read them."
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

  return new Error(
    error?.message ||
      "Could not access website analytics. Please verify your database and rules."
  );
}

function buildDateKeys(daysBack) {
  const keys = [];
  const cursor = new Date();

  for (let index = 0; index < daysBack; index += 1) {
    keys.push(formatDateKey(cursor));
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return keys;
}

function buildHourKeys(hoursBack) {
  const keys = [];
  const cursor = new Date();

  for (let index = 0; index < hoursBack; index += 1) {
    keys.push(formatHourKey(cursor));
    cursor.setUTCHours(cursor.getUTCHours() - 1);
  }

  return keys.reverse();
}

function sumBucketMetrics(buckets) {
  return buckets.reduce(
    (totals, bucket) => ({
      pageViews: totals.pageViews + (bucket.pageViews || 0),
      uniqueVisitors: totals.uniqueVisitors + (bucket.uniqueVisitors || 0),
    }),
    { pageViews: 0, uniqueVisitors: 0 }
  );
}

function countActiveLiveSessions(sessions) {
  const cutoff = Date.now() - LIVE_SESSION_TTL_MS;

  return sessions.filter((session) => {
    const lastSeenMs = session.lastSeen?.toMillis?.() ?? 0;
    return lastSeenMs >= cutoff;
  }).length;
}

export async function recordPageView(pathname) {
  const sessionId = getOrCreateSessionId();
  if (!sessionId || !pathname) {
    return;
  }

  const now = new Date();
  const dateKey = formatDateKey(now);
  const hourKey = formatHourKey(now);
  const dailyRef = doc(db, "analyticsDaily", dateKey);
  const hourlyRef = doc(db, "analyticsHourly", hourKey);
  const dailySessionRef = doc(db, "analyticsDaily", dateKey, "sessions", sessionId);
  const hourlySessionRef = doc(db, "analyticsHourly", hourKey, "sessions", sessionId);
  const liveRef = doc(db, "analyticsLive", sessionId);

  try {
    const [dailySessionSnap, hourlySessionSnap] = await Promise.all([
      getDoc(dailySessionRef),
      getDoc(hourlySessionRef),
    ]);

    const writes = [
      setDoc(
        liveRef,
        {
          path: pathname,
          lastSeen: serverTimestamp(),
          sessionId,
        },
        { merge: true }
      ),
      setDoc(
        dailyRef,
        {
          pageViews: increment(1),
          updatedAt: serverTimestamp(),
          ...(dailySessionSnap.exists()
            ? {}
            : { uniqueVisitors: increment(1) }),
        },
        { merge: true }
      ),
      setDoc(
        hourlyRef,
        {
          pageViews: increment(1),
          updatedAt: serverTimestamp(),
          ...(hourlySessionSnap.exists()
            ? {}
            : { uniqueVisitors: increment(1) }),
        },
        { merge: true }
      ),
      setDoc(
        dailySessionRef,
        {
          firstSeen: serverTimestamp(),
          lastPath: pathname,
        },
        { merge: true }
      ),
      setDoc(
        hourlySessionRef,
        {
          firstSeen: serverTimestamp(),
          lastPath: pathname,
        },
        { merge: true }
      ),
    ];

    await Promise.all(writes);
  } catch (error) {
    console.warn("[analytics] Could not record page view:", error);
  }
}

export function subscribeAnalyticsDashboard({ onData, onError }) {
  const dailyKeys = buildDateKeys(31);
  const hourKeys = buildHourKeys(24);
  const dailyUnsubs = [];
  const dailyBuckets = new Map(dailyKeys.map((key) => [key, { pageViews: 0, uniqueVisitors: 0 }]));
  const hourlyBuckets = new Map(hourKeys.map((key) => [key, { pageViews: 0, uniqueVisitors: 0 }]));
  let liveSessions = [];
  let hasDailyData = false;
  let hasHourlyData = false;

  const emit = () => {
    const dailyList = dailyKeys.map((key) => ({
      key,
      ...dailyBuckets.get(key),
    }));
    const hourlyList = hourKeys.map((key) => ({
      key,
      label: key.slice(11),
      ...hourlyBuckets.get(key),
    }));

    const last24Hours = sumBucketMetrics(hourlyList);
    const last7Days = sumBucketMetrics(dailyList.slice(0, 7));
    const last30Days = sumBucketMetrics(dailyList);

    onData({
      loading: !hasDailyData || !hasHourlyData,
      realtimeActive: countActiveLiveSessions(liveSessions),
      liveSessions,
      last24Hours,
      last7Days,
      last30Days,
      hourlySeries: hourlyList,
      dailySeries: dailyList
        .slice(0, 7)
        .reverse()
        .map((item) => ({
          ...item,
          label: item.key.slice(5),
        })),
    });
  };

  const handleSnapshotError = (error) => {
    onError?.(getFirestoreAnalyticsError(error));
  };

  dailyKeys.forEach((key) => {
    const ref = doc(db, "analyticsDaily", key);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        dailyBuckets.set(key, {
          pageViews: snapshot.data()?.pageViews || 0,
          uniqueVisitors: snapshot.data()?.uniqueVisitors || 0,
        });
        hasDailyData = true;
        emit();
      },
      handleSnapshotError
    );
    dailyUnsubs.push(unsubscribe);
  });

  const hourlyUnsubs = hourKeys.map((key) => {
    const ref = doc(db, "analyticsHourly", key);
    return onSnapshot(
      ref,
      (snapshot) => {
        hourlyBuckets.set(key, {
          pageViews: snapshot.data()?.pageViews || 0,
          uniqueVisitors: snapshot.data()?.uniqueVisitors || 0,
        });
        hasHourlyData = true;
        emit();
      },
      handleSnapshotError
    );
  });

  const liveUnsub = onSnapshot(
    collection(db, "analyticsLive"),
    (snapshot) => {
      liveSessions = snapshot.docs.map((liveDoc) => ({
        id: liveDoc.id,
        ...liveDoc.data(),
      }));
      emit();
    },
    handleSnapshotError
  );

  return () => {
    dailyUnsubs.forEach((unsubscribe) => unsubscribe());
    hourlyUnsubs.forEach((unsubscribe) => unsubscribe());
    liveUnsub();
  };
}

export function formatAnalyticsTimestamp(value) {
  if (!value) {
    return "—";
  }

  const date =
    value instanceof Timestamp ? value.toDate() : value instanceof Date ? value : null;

  if (!date) {
    return "—";
  }

  const diffMs = Date.now() - date.getTime();
  if (diffMs < MS_PER_DAY) {
    const minutes = Math.max(1, Math.round(diffMs / 60000));
    return `${minutes} min ago`;
  }

  return date.toLocaleString();
}
