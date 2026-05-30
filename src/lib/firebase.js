import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0yIicuwV-yx8gVqK3jxa2ijJsx1d8jf0",
  authDomain: "zohaib-1e0c7.firebaseapp.com",
  projectId: "zohaib-1e0c7",
  storageBucket: "zohaib-1e0c7.firebasestorage.app",
  messagingSenderId: "856701273766",
  appId: "1:856701273766:web:7bbab4052b9a15c7c25667",
  measurementId: "G-5N4WTSM5XK",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const analyticsPromise =
  typeof window !== "undefined"
    ? isSupported()
        .then((supported) => (supported ? getAnalytics(app) : null))
        .catch(() => null)
    : Promise.resolve(null);

export { app, auth, db, analyticsPromise };
