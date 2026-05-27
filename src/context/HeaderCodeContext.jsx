import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_HEADER_CONFIG,
  subscribeToHeaderConfig,
} from "../services/headerConfig";

const HeaderCodeContext = createContext(null);

export function HeaderCodeProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_HEADER_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToHeaderConfig(
      (nextConfig) => {
        setConfig(nextConfig);
        setError("");
        setLoading(false);
      },
      (firebaseError) => {
        setConfig(DEFAULT_HEADER_CONFIG);
        setError(
          firebaseError?.message ||
            "Could not load header settings from Firestore. No custom header code is active."
        );
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      config,
      loading,
      error,
      setConfig,
    }),
    [config, error, loading]
  );

  return (
    <HeaderCodeContext.Provider value={value}>
      {children}
    </HeaderCodeContext.Provider>
  );
}

export function useHeaderCodeContext() {
  const context = useContext(HeaderCodeContext);

  if (!context) {
    throw new Error("useHeaderCodeContext must be used within a HeaderCodeProvider.");
  }

  return context;
}
