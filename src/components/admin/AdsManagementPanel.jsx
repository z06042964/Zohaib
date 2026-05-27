import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  MonitorCog,
  RefreshCw,
  Save,
  SquareTerminal,
  TriangleAlert,
} from "lucide-react";
import Button from "../ui/Button";
import useAdsConfig from "../../hooks/useAdsConfig";
import { saveAdsConfig } from "../../services/adsConfig";

const textareaClass =
  "min-h-[150px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500";

const ADS_FIELDS = [
  {
    key: "headerAdCode",
    title: "Header ad placement",
    description:
      "Code shown near the top of public pages under the main website header/navbar.",
    placeholder:
      '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxxxx" data-ad-slot="1111111111"></ins>',
  },
  {
    key: "routeAdCode",
    title: "Route/page ad placement",
    description:
      "Sitewide page-level ad block shown before page content. Use this to manage route-level ad placement.",
    placeholder:
      '<div class="ad-box">Route or page ad placement</div>',
  },
  {
    key: "homeAdCode",
    title: "Homepage ad placement",
    description:
      "Extra ad code shown only on the homepage. Useful for homepage hero or homepage content ads.",
    placeholder:
      '<div class="ad-box">Homepage ad placement</div>',
  },
  {
    key: "toolPagesAdCode",
    title: "Tool pages ad placement",
    description:
      "Code shown on tool pages like Background Remover, PNG to JPG, and Image Compressor.",
    placeholder:
      '<div class="ad-box">Tool page ad placement</div>',
  },
  {
    key: "footerAdCode",
    title: "Footer ad placement",
    description:
      "Code shown above the public website footer. Good for bottom banner or sticky ad blocks.",
    placeholder:
      '<div class="ad-box">Footer ad placement</div>',
  },
];

export default function AdsManagementPanel() {
  const { config, loading, error, setConfig } = useAdsConfig();
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

  const activePlacements = useMemo(
    () => ADS_FIELDS.filter(({ key }) => draftConfig[key]?.trim()).length,
    [draftConfig]
  );

  const handleFieldChange = (field, value) => {
    setDraftConfig((current) => ({ ...current, [field]: value }));
    setIsDirty(true);
    setFormMessage("");
    setFormError("");
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
      const savedConfig = await saveAdsConfig(draftConfig);
      setConfig(savedConfig);
      setIsDirty(false);
      setFormMessage(
        "Ads placements published successfully. Public website placements now use the latest Firebase data."
      );
    } catch (saveError) {
      setFormError(
        saveError?.message ||
          "Could not save ads settings. Please verify Firestore database access."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
              Ads management
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Manage ad placements across your website
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Add ad code for multiple placements like header, route/page,
              homepage, tool pages, and footer. This helps you adjust ad places
              across the website from one Firebase-powered panel.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
            <p className="font-semibold">Live source</p>
            <p className="mt-1">Firestore document: `siteContent/ads`</p>
            <p className="mt-2 font-medium">{activePlacements} active placements</p>
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

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={handleReset} disabled={!isDirty}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Reset changes
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !isDirty}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Publishing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" aria-hidden="true" />
                Publish ads settings
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading ads settings from Firebase...
          </div>
        ) : null}

        <div className="mt-8 grid gap-6">
          {ADS_FIELDS.map(({ key, title, description, placeholder }) => (
            <section
              key={key}
              className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5 shadow-soft"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft">
                  {key === "headerAdCode" ? (
                    <MonitorCog className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <SquareTerminal className="h-5 w-5" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {description}
                  </p>
                </div>
              </div>

              <textarea
                value={draftConfig[key]}
                onChange={(event) => handleFieldChange(key, event.target.value)}
                placeholder={placeholder}
                className={`${textareaClass} mt-5`}
                spellCheck={false}
              />
            </section>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
        <h3 className="text-lg font-bold text-slate-900">Placement tips</h3>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
          <li>Use `Header ad placement` for banner ads shown near the top of public pages.</li>
          <li>Use `Route/page ad placement` for a sitewide page-level block before content.</li>
          <li>Use `Homepage` and `Tool pages` fields for more targeted ad placement control.</li>
          <li>Use `Footer ad placement` for bottom-of-page banners or final ad blocks.</li>
        </ul>
      </div>
    </div>
  );
}
