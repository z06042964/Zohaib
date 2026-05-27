import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Code2,
  FileCode2,
  Loader2,
  RefreshCw,
  Save,
  SearchCheck,
  TriangleAlert,
} from "lucide-react";
import Button from "../ui/Button";
import useHeaderCode from "../../hooks/useHeaderCode";
import {
  buildCombinedHeadCode,
  saveHeaderConfig,
} from "../../services/headerConfig";

const textareaClass =
  "min-h-[150px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500";

const FIELD_CONFIG = [
  {
    key: "adsenseCode",
    title: "Google AdSense code",
    description:
      "Paste your AdSense script or verification code exactly as provided by Google.",
    placeholder:
      '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxx" crossorigin="anonymous"></script>',
    icon: FileCode2,
  },
  {
    key: "searchConsoleCode",
    title: "Google Search Console code",
    description:
      "Paste your verification meta tag from Google Search Console so it appears inside the website head.",
    placeholder:
      '<meta name="google-site-verification" content="your-verification-code" />',
    icon: SearchCheck,
  },
  {
    key: "customHeadCode",
    title: "Custom header code",
    description:
      "Add any extra trusted head code such as analytics, pixels, meta tags, scripts, or other integrations.",
    placeholder:
      '<script>console.log("Custom header code")</script>\n<link rel="preconnect" href="https://example.com" />',
    icon: Code2,
  },
];

export default function HeaderManagementPanel() {
  const { config, loading, error, setConfig } = useHeaderCode();
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

  const combinedPreview = useMemo(
    () => buildCombinedHeadCode(draftConfig),
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
      const savedConfig = await saveHeaderConfig(draftConfig);
      setConfig(savedConfig);
      setIsDirty(false);
      setFormMessage(
        "Header code published successfully. Public website pages will now inject this code into the head."
      );
    } catch (saveError) {
      setFormError(
        saveError?.message ||
          "Could not save header code. Please verify Firestore database access."
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
              Header management
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Inject code into the website header
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Use these fields to inject trusted head code across your public
              website pages, such as Google AdSense, Google Search Console
              verification, analytics scripts, pixels, or any custom header code.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <p className="font-semibold">Trusted admins only</p>
            <p className="mt-1">
              Any code saved here will run in your website head. Only paste trusted code.
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
                Publish header code
              </>
            )}
          </Button>
        </div>

        <div className="mt-8 grid gap-6">
          {loading ? (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading header settings from Firebase...
            </div>
          ) : null}

          {FIELD_CONFIG.map(({ key, title, description, placeholder, icon: Icon }) => (
            <section
              key={key}
              className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5 shadow-soft"
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {description}
                  </p>
                </div>
              </div>

              <textarea
                value={draftConfig[key]}
                onChange={(event) => handleFieldChange(key, event.target.value)}
                placeholder={placeholder}
                className={textareaClass}
                spellCheck={false}
              />
            </section>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
        <h3 className="text-lg font-bold text-slate-900">Combined header preview</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          This is the final head code that will be injected on your public website pages.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
          <code>{combinedPreview || "<!-- No custom header code added yet -->"}</code>
        </pre>
      </div>
    </div>
  );
}
