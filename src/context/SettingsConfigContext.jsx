import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_SETTINGS_CONFIG,
  subscribeToSettingsConfig,
} from "../services/settingsConfig";

const SettingsConfigContext = createContext(null);

export function SettingsConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_SETTINGS_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToSettingsConfig(
      (nextConfig) => {
        setConfig(nextConfig);
        setError("");
        setLoading(false);
      },
      (firebaseError) => {
        setConfig(DEFAULT_SETTINGS_CONFIG);
        setError(
          firebaseError?.message ||
            "Could not load website settings from Firestore. Default settings are active."
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
    <SettingsConfigContext.Provider value={value}>
      {children}
    </SettingsConfigContext.Provider>
  );
}

export function useSettingsConfigContext() {
  const context = useContext(SettingsConfigContext);

  if (!context) {
    throw new Error(
      "useSettingsConfigContext must be used within a SettingsConfigProvider."
    );
  }

  return context;
}
