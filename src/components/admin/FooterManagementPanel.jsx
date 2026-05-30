import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  CircleHelp,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Share2,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import Button from "../ui/Button";
import useFooterConfig from "../../hooks/useFooterConfig";
import {
  createEmptyFooterLink,
  createEmptySocialLink,
  saveFooterConfig,
} from "../../services/footerConfig";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500";

const textareaClass =
  "min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500";

const SOCIAL_ICON_OPTIONS = [
  { value: "share2", label: "Share" },
  { value: "globe", label: "Website" },
  { value: "mail", label: "Email" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "youtube", label: "YouTube" },
];

function moveItem(items, index, direction) {
  const next = items.slice();
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= next.length) {
    return items;
  }

  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
}

function EditableLinksSection({
  title,
  description,
  items,
  onAdd,
  onDelete,
  onMove,
  onChange,
}) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add link
        </Button>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Link label
                </label>
                <input
                  value={item.label}
                  onChange={(event) => onChange(item.id, "label", event.target.value)}
                  placeholder="About"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  URL or anchor
                </label>
                <input
                  value={item.href}
                  onChange={(event) => onChange(item.id, "href", event.target.value)}
                  placeholder="/about or /#faq"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Type
                  </label>
                  <select
                    value={item.isRoute ? "route" : "link"}
                    onChange={(event) =>
                      onChange(item.id, "isRoute", event.target.value === "route")
                    }
                    className={inputClass}
                  >
                    <option value="route">React route</option>
                    <option value="link">Standard link</option>
                  </select>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onMove(index, -1)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onMove(index, 1)}
                  disabled={index === items.length - 1}
                >
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="border-red-200 text-red-600 hover:border-red-300 hover:text-red-700"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function FooterManagementPanel() {
  const { config, loading, error, setConfig } = useFooterConfig();
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

  const isValid = useMemo(
    () =>
      draftConfig.quickLinks.every((item) => item.label.trim() && item.href.trim()) &&
      draftConfig.toolLinks.every((item) => item.label.trim() && item.href.trim()) &&
      draftConfig.socialLinks.every((item) => item.label.trim() && item.href.trim()),
    [draftConfig]
  );

  const updateDraft = (updater) => {
    setDraftConfig((current) => updater(current));
    setIsDirty(true);
    setFormMessage("");
    setFormError("");
  };

  const updateListField = (listKey, id, field, value) => {
    updateDraft((current) => ({
      ...current,
      [listKey]: current[listKey].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateListOrder = (listKey, index, direction) => {
    updateDraft((current) => ({
      ...current,
      [listKey]: moveItem(current[listKey], index, direction),
    }));
  };

  const deleteFromList = (listKey, id) => {
    updateDraft((current) => ({
      ...current,
      [listKey]: current[listKey].filter((item) => item.id !== id),
    }));
  };

  const addToList = (listKey, itemFactory) => {
    updateDraft((current) => ({
      ...current,
      [listKey]: [...current[listKey], itemFactory()],
    }));
  };

  const handleReset = () => {
    setDraftConfig(config);
    setIsDirty(false);
    setFormError("");
    setFormMessage("");
  };

  const handleSave = async () => {
    setFormError("");
    setFormMessage("");

    if (!isValid) {
      setFormError("Please fill in label and URL for every footer and social item.");
      return;
    }

    setIsSaving(true);

    try {
      const savedConfig = await saveFooterConfig(draftConfig);
      setConfig(savedConfig);
      setIsDirty(false);
      setFormMessage(
        "Footer published successfully. Description, footer links, and social icons are updated in realtime."
      );
    } catch (saveError) {
      setFormError(
        saveError?.message ||
          "Could not save footer settings. Please verify Firestore database access."
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
              Footer management
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Manage footer links, social icons, and description
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Update the footer text shown under your website title, control footer
              links, reorder them, and manage social icons with realtime Firebase sync.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
            <p className="font-semibold">Live source</p>
            <p className="mt-1">Firestore document: `siteContent/footer`</p>
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
                Publish footer
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading footer settings from Firebase...
          </div>
        ) : null}

        <div className="mt-8 space-y-6">
          <section className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft">
                <CircleHelp className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Footer description</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  This text is shown under your website title/logo in the footer.
                </p>
              </div>
            </div>

            <textarea
              value={draftConfig.brandDescription}
              onChange={(event) =>
                updateDraft((current) => ({
                  ...current,
                  brandDescription: event.target.value,
                }))
              }
              placeholder="Add footer description..."
              className={`${textareaClass} mt-5`}
            />
          </section>

          <EditableLinksSection
            title="Quick links"
            description="Manage the main footer links shown in the Quick Links column. Sitemap XML and Robots TXT are included for your live SEO files."
            items={draftConfig.quickLinks}
            onAdd={() => addToList("quickLinks", createEmptyFooterLink)}
            onDelete={(id) => deleteFromList("quickLinks", id)}
            onMove={(index, direction) => updateListOrder("quickLinks", index, direction)}
            onChange={(id, field, value) =>
              updateListField("quickLinks", id, field, value)
            }
          />

          <EditableLinksSection
            title="Tool links"
            description="Manage the footer links shown in the Tools column."
            items={draftConfig.toolLinks}
            onAdd={() => addToList("toolLinks", createEmptyFooterLink)}
            onDelete={(id) => deleteFromList("toolLinks", id)}
            onMove={(index, direction) => updateListOrder("toolLinks", index, direction)}
            onChange={(id, field, value) =>
              updateListField("toolLinks", id, field, value)
            }
          />

          <section className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Social icons</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Add, delete, or reorder social icons and choose which icon should appear.
                </p>
              </div>
              <Button size="sm" onClick={() => addToList("socialLinks", createEmptySocialLink)}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add social icon
              </Button>
            </div>

            <div className="mt-5 space-y-4">
              {draftConfig.socialLinks.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"
                >
                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr_220px_auto]">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Social label
                      </label>
                      <input
                        value={item.label}
                        onChange={(event) =>
                          updateListField("socialLinks", item.id, "label", event.target.value)
                        }
                        placeholder="Instagram"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        URL or route
                      </label>
                      <input
                        value={item.href}
                        onChange={(event) =>
                          updateListField("socialLinks", item.id, "href", event.target.value)
                        }
                        placeholder="https://instagram.com/yourpage"
                        className={inputClass}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Icon
                        </label>
                        <select
                          value={item.iconKey}
                          onChange={(event) =>
                            updateListField(
                              "socialLinks",
                              item.id,
                              "iconKey",
                              event.target.value
                            )
                          }
                          className={inputClass}
                        >
                          {SOCIAL_ICON_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Link type
                        </label>
                        <select
                          value={item.isRoute ? "route" : "link"}
                          onChange={(event) =>
                            updateListField(
                              "socialLinks",
                              item.id,
                              "isRoute",
                              event.target.value === "route"
                            )
                          }
                          className={inputClass}
                        >
                          <option value="link">Standard link</option>
                          <option value="route">React route</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-end gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => updateListOrder("socialLinks", index, -1)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => updateListOrder("socialLinks", index, 1)}
                        disabled={index === draftConfig.socialLinks.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="border-red-200 text-red-600 hover:border-red-300 hover:text-red-700"
                        onClick={() => deleteFromList("socialLinks", item.id)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-3">
          <Share2 className="h-5 w-5 text-brand-600" aria-hidden="true" />
          <h3 className="text-lg font-bold text-slate-900">Footer management tips</h3>
        </div>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
          <li>Use `React route` for internal paths like `/about` or `/contact`.</li>
          <li>Use `Standard link` for anchors like `/#faq`, `mailto:` links, or external URLs.</li>
          <li>Use `Standard link` for static SEO files like `/sitemap.xml` and `/robots.txt`.</li>
          <li>Publishing updates the public footer in realtime from Firebase.</li>
        </ul>
      </div>
    </div>
  );
}
