import { Outlet } from "react-router-dom";
import AdminLoadingScreen from "../admin/AdminLoadingScreen";
import useSettingsConfig from "../../hooks/useSettingsConfig";
import MaintenanceMode from "../../pages/MaintenanceMode";

export default function PublicSiteGate() {
  const { config, loading, error } = useSettingsConfig();

  if (loading) {
    return <AdminLoadingScreen label="Loading website..." />;
  }

  if (error) {
    return <Outlet />;
  }

  if (config.maintenanceModeEnabled) {
    return <MaintenanceMode />;
  }

  return <Outlet />;
}
