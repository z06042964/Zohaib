import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { recordPageView } from "../services/analytics";

export default function usePageAnalytics() {
  const { pathname } = useLocation();

  useEffect(() => {
    recordPageView(pathname);
  }, [pathname]);
}
