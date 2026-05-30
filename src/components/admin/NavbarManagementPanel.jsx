import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  GripVertical,
  Link2,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import Button from "../ui/Button";
import useNavbarLinks from "../../hooks/useNavbarLinks";
import {
  createEmptyNavbarLink,
  saveNavbarLinks,
} from "../../services/navbarConfig";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500";

export default function NavbarManagementPanel() {
  const { links, loading, error, setLinks } = useNavbarLinks();
  const [draftLinks, setDraftLinks] = useState(links);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isDirty) {
      setDraftLinks(links);
    }
  }, [isDirty, links]);

  const canSave = useMemo(
    () =>
      draftLinks.length > 0 &&
      draftLinks.every((link) => link.label.trim() && link.href.trim()),
    [draftLinks]
  );

  const touchDraft = (updater) => {
    setDraftLinks((current) => updater(current));
    setIsDirty(true);
    setFormMessage("");
    setFormError("");
  };

  const handleFieldChange = (id, field, value) => {
    touchDraft((current) =>
      current.map((link) => (link.id === id ? { ...link, [field]: value } : link))
    );
  };

  const handleAddLink = () => {
    touchDraft((current) => [...current, createEmptyNavbarLink()]);
  };

  const handleDeleteLink = (id) => {
    touchDraft((current) => current.filter((link) => link.id !== id));
  };

  const moveLink = (index, direction) => {
    touchDraft((current) => {
      const next = current.slice();
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= next.length) {
        return current;
      }

      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const handleReset = () => {
    setDraftLinks(links);
    setIsDirty(false);
    setFormMessage("");
    setFormError("");
  };

  const handleSave = async () => {
    setFormMessage("");
    setFormError("");

    if (!draftLinks.length) {
      setFormError("At least one navbar link is required.");
      return;
    }

    if (!canSave) {
      setFormError("Please fill in both label and URL for every navbar link.");
      return;
    }

    setIsSaving(true);

    try {
      const savedLinks = await saveNavbarLinks(draftLinks);
      setLinks(savedLinks);
      setIsDirty(false);
      setFormMessage("Navbar links published successfully. The website updates in realtime.");
    } catch (saveError) {
      setFormError(
        saveError?.message ||
          "Could not save navbar links. Make sure Firestore is enabled in Firebase."
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
              Nav bar management
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Manage navbar links in realtime
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Add, delete, edit, and reorder the main website navbar links. Once
              you publish changes, the public navbar updates from Firebase in realtime.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
            <p className="font-semibold">Live source</p>
            <p className="mt-1">Firestore document: `siteContent/navbar`</p>
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
          <Button onClick={handleAddLink}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add navbar link
          </Button>
          <Button variant="secondary" onClick={handleReset} disabled={!isDirty}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Reset changes
          </Button>
          <Button onClick={handleSave} disabled={!isDirty || !canSave || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Publish navbar
              </>
            )}
          </Button>
        </div>

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading navbar links from Firebase...
            </div>
          ) : null}

          {!loading && draftLinks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              No links yet. Add your first navbar link to get started.
            </div>
          ) : null}

          {draftLinks.map((link, index) => (
            <article
              key={link.id}
              className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-soft sm:p-5"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
                <div className="flex items-center gap-3 xl:w-24">
                  <div className="rounded-2xl bg-white p-2 text-slate-400 shadow-soft">
                    <GripVertical className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Link {index + 1}
                    </p>
                  </div>
                </div>

                <div className="grid flex-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`label-${link.id}`}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Link label
                    </label>
                    <input
                      id={`label-${link.id}`}
                      value={link.label}
                      onChange={(event) =>
                        handleFieldChange(link.id, "label", event.target.value)
                      }
                      placeholder="About"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`href-${link.id}`}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      URL or anchor
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-4 inline-flex items-center text-slate-400">
                        <Link2 className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <input
                        id={`href-${link.id}`}
                        value={link.href}
                        onChange={(event) =>
                          handleFieldChange(link.id, "href", event.target.value)
                        }
                        placeholder="/about or /#tools"
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`type-${link.id}`}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Link behavior
                    </label>
                    <select
                      id={`type-${link.id}`}
                      value={link.isRoute ? "route" : "link"}
                      onChange={(event) =>
                        handleFieldChange(link.id, "isRoute", event.target.value === "route")
                      }
                      className={inputClass}
                    >
                      <option value="route">React route</option>
                      <option value="link">Standard link / anchor</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-end gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => moveLink(index, -1)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" aria-hidden="true" />
                      Move up
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => moveLink(index, 1)}
                      disabled={index === draftLinks.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" aria-hidden="true" />
                      Move down
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="border-red-200 text-red-600 hover:border-red-300 hover:text-red-700"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
        <h3 className="text-lg font-bold text-slate-900">Current structure tips</h3>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
          <li>Use `React route` for paths like `/about` or `/contact`.</li>
          <li>Use `Standard link / anchor` for anchors like `/#tools` or external URLs.</li>
          <li>After publishing, your website navbar listens to Firebase and updates instantly.</li>
        </ul>
      </div>
    </div>
  );
}
