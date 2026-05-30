import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_ADS_CONFIG, subscribeToAdsConfig } from "../services/adsConfig";

const AdsConfigContext = createContext(null);

export function AdsConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_ADS_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToAdsConfig(
      (nextConfig) => {
        setConfig(nextConfig);
        setError("");
        setLoading(false);
      },
      (firebaseError) => {
        setConfig(DEFAULT_ADS_CONFIG);
        setError(
          firebaseError?.message ||
            "Could not load ads settings from Firestore. No custom ad placements are active."
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

  return <AdsConfigContext.Provider value={value}>{children}</AdsConfigContext.Provider>;
}

export function useAdsConfigContext() {
  const context = useContext(AdsConfigContext);

  if (!context) {
    throw new Error("useAdsConfigContext must be used within an AdsConfigProvider.");
  }

  return context;
}
