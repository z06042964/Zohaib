import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  RefreshCw,
  Save,
  Settings,
  TriangleAlert,
} from "lucide-react";
import Button from "../ui/Button";
import useSettingsConfig from "../../hooks/useSettingsConfig";
import { saveSettingsConfig } from "../../services/settingsConfig";

function ToggleField({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
        checked ? "bg-brand-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function SettingsManagementPanel() {
  const { config, loading, error, setConfig } = useSettingsConfig();
  const [draftConfig, setDraftConfig] = useState(config);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isDirty) {
      setDraftConfig(config);
    }
  }, [config, isDirty]);

  const maintenanceEnabled = Boolean(draftConfig.maintenanceModeEnabled);

  const handleInputChange = (field, value) => {
    setDraftConfig((current) => ({
      ...current,
      [field]: value,
    }));
    setIsDirty(true);
    setFormMessage("");
    setFormError("");
  };

  const handleToggleChange = (enabled) => {
    handleInputChange("maintenanceModeEnabled", enabled);
  };

  const handleReset = () => {
    setDraftConfig(config);
    setIsDirty(false);
    setFormMessage("");
    setFormError("");
  };

  const handleSave = async () => {
    setFormMessage("");
    setFormError("");
    setIsSaving(true);

    try {
      const savedConfig = await saveSettingsConfig(draftConfig);
      setConfig(savedConfig);
      setIsDirty(false);
      setFormMessage(
        savedConfig.maintenanceModeEnabled
          ? "Website settings saved. Maintenance mode is now ON and the latest website title is live."
          : "Website settings saved. Maintenance mode is OFF and the latest website title is live."
      );
    } catch (saveError) {
      setFormError(
        saveError?.message ||
          "Could not save website settings. Please verify Firestore access."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Settings className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
              Website settings
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Enable or disable maintenance mode
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Turn maintenance mode on when you want public visitors to see a
              maintenance screen. Turn it off and save to make the public website
              live again. You can also change the website title here and update
              header, footer, and page titles across the website. Your admin pages
              will remain accessible.
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        ) : null}

        {formError ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>{formError}</p>
          </div>
        ) : null}

        {formMessage ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>{formMessage}</p>
          </div>
        ) : null}

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Website title</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              This title is used across the website branding, including header
              logo text, footer brand text, and browser page titles.
            </p>
          </div>

          <div className="mt-5">
            <label
              htmlFor="siteTitle"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Website title
            </label>
            <input
              id="siteTitle"
              type="text"
              value={draftConfig.siteTitle}
              onChange={(event) => handleInputChange("siteTitle", event.target.value)}
              placeholder="Imgoraa"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Maintenance mode</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                Current status:{" "}
                <span className={maintenanceEnabled ? "font-semibold text-amber-700" : "font-semibold text-emerald-700"}>
                  {maintenanceEnabled ? "Enabled" : "Disabled"}
                </span>
              </p>
            </div>

            <ToggleField
              checked={maintenanceEnabled}
              onChange={handleToggleChange}
              disabled={loading || isSaving}
            />
          </div>
        </div>

        {loading ? (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading website settings from Firebase...
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={handleReset} disabled={!isDirty}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Reset changes
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !isDirty}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Saving settings...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" aria-hidden="true" />
                Save settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
