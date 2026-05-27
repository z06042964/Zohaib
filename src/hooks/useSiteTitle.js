import useSettingsConfig from "./useSettingsConfig";
import { DEFAULT_SITE_TITLE, normalizeSiteTitle } from "../services/siteBranding";

export default function useSiteTitle() {
  const { config } = useSettingsConfig();
  return normalizeSiteTitle(config?.siteTitle || DEFAULT_SITE_TITLE);
}
