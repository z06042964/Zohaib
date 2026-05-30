import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_FOOTER_CONFIG,
  subscribeToFooterConfig,
} from "../services/footerConfig";

const FooterConfigContext = createContext(null);

export function FooterConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_FOOTER_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToFooterConfig(
      (nextConfig) => {
        setConfig(nextConfig);
        setError("");
        setLoading(false);
      },
      (firebaseError) => {
        setConfig(DEFAULT_FOOTER_CONFIG);
        setError(
          firebaseError?.message ||
            "Could not load footer settings from Firestore. Showing default footer."
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
    <FooterConfigContext.Provider value={value}>
      {children}
    </FooterConfigContext.Provider>
  );
}

export function useFooterConfigContext() {
  const context = useContext(FooterConfigContext);

  if (!context) {
    throw new Error("useFooterConfigContext must be used within a FooterConfigProvider.");
  }

  return context;
}
