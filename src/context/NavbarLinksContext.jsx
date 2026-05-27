import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_NAV_LINKS } from "../constants/navigation";
import { subscribeToNavbarLinks } from "../services/navbarConfig";

const NavbarLinksContext = createContext(null);

export function NavbarLinksProvider({ children }) {
  const [links, setLinks] = useState(DEFAULT_NAV_LINKS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToNavbarLinks(
      (nextLinks) => {
        setLinks(nextLinks);
        setError("");
        setLoading(false);
      },
      (firebaseError) => {
        setError(
          firebaseError?.message ||
            "Could not connect to Firebase navbar settings. Showing default links."
        );
        setLinks(DEFAULT_NAV_LINKS);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      links,
      loading,
      error,
      setLinks,
    }),
    [error, links, loading]
  );

  return (
    <NavbarLinksContext.Provider value={value}>
      {children}
    </NavbarLinksContext.Provider>
  );
}

export function useNavbarLinksContext() {
  const context = useContext(NavbarLinksContext);

  if (!context) {
    throw new Error("useNavbarLinksContext must be used within a NavbarLinksProvider.");
  }

  return context;
}
