import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Loader2,
  RefreshCw,
  Minimize2,
  AlertCircle,
  Zap,
} from "lucide-react";
import Button from "../components/ui/Button";
import ImageDropzone from "../components/tools/ImageDropzone";
import FormatSelector from "../components/tools/FormatSelector";
import {
  compressImage,
  COMPRESSION_PRESETS,
  MAX_WIDTH_OPTIONS,
  OUTPUT_OPTIONS,
  formatFileSize,
} from "../services/imageCompressor";

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultBlob, setResultBlob] = useState(null);
  const [resultExtension, setResultExtension] = useState("jpg");
  const [preset, setPreset] = useState("balanced");
  const [quality, setQuality] = useState(0.7);
  const [maxWidth, setMaxWidth] = useState(null);
  const [outputFormat, setOutputFormat] = useState("auto");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const cleanupUrls = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [originalUrl, resultUrl]);

  useEffect(() => () => cleanupUrls(), [cleanupUrls]);

  const handlePresetChange = (presetId) => {
    setPreset(presetId);
    const selected = COMPRESSION_PRESETS.find((p) => p.id === presetId);
    if (selected) setQuality(selected.quality);
  };

  const handleFileSelect = (file) => {
    cleanupUrls();
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setResultBlob(null);
    setError(null);
    setStatus("ready");
  };

  const handleCompress = async () => {
    if (!originalFile) return;

    setError(null);
    setStatus("processing");
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
      setResultBlob(null);
    }

    try {
      const result = await compressImage(originalFile, {
        quality,
        maxWidth,
        outputFormat,
      });
      setResultBlob(result.blob);
      setResultExtension(result.extension);
      setResultUrl(URL.createObjectURL(result.blob));
      setStatus("success");
    } catch (err) {
      setError(err.message || "Compression failed. Please try again.");
      setStatus("ready");
    }
  };

  const handleReset = () => {
    cleanupUrls();
    setOriginalFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setResultBlob(null);
    setError(null);
    setStatus("idle");
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const baseName =
      originalFile?.name?.replace(/\.[^.]+$/, "") || "compressed-image";
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `${baseName}-compressed.${resultExtension}`;
    link.click();
  };

  const isProcessing = status === "processing";
  const savedBytes =
    originalFile && resultBlob ? originalFile.size - resultBlob.size : 0;
  const savedPercent =
    originalFile && resultBlob && originalFile.size > 0
      ? Math.round((savedBytes / originalFile.size) * 100)
      : 0;

  const outputFormatsForSelector = OUTPUT_OPTIONS.map((o) => ({
    id: o.id,
    label: o.label,
    extension: o.id === "auto" ? "auto" : o.id === "jpeg" ? "jpg" : o.id,
    supportsQuality: false,
    description: o.description,
  }));

  return (
    <main className="pt-24 pb-16 sm:pt-28 sm:pb-24">
      <div className="section-container">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Home
        </Link>

        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <Minimize2
                className="h-7 w-7"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Image Compressor
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Reduce image file size without leaving your browser. Adjust
              quality, resize, and download instantly.
            </p>
          </div>

          {status === "idle" && (
            <ImageDropzone
              onFileSelect={handleFileSelect}
              accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
            />
          )}

          {(status === "ready" || status === "processing") && originalUrl && (
            <div className="space-y-8">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Original image
                  </p>
                  <p className="text-xs text-slate-500">
                    {originalFile?.name} · {formatFileSize(originalFile?.size)}
                  </p>
                </div>
                <div className="flex justify-center bg-slate-100/50 p-6">
                  <img
                    src={originalUrl}
                    alt="Original"
                    loading="lazy"
                    decoding="async"
                    className="max-h-64 max-w-full rounded-lg object-contain shadow-sm"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="text-lg font-bold text-slate-900">
                  Compression settings
                </h2>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-slate-700">Preset</p>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {COMPRESSION_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handlePresetChange(p.id)}
                        className={`rounded-xl border-2 px-3 py-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 ${
                          preset === p.id
                            ? "border-brand-500 bg-brand-50"
                            : "border-slate-200 hover:border-brand-300"
                        }`}
                      >
                        <span className="block text-sm font-bold text-slate-900">
                          {p.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {p.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="compress-quality"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Quality
                    </label>
                    <span className="text-sm font-medium text-brand-600">
                      {Math.round(quality * 100)}%
                    </span>
                  </div>
                  <input
                    id="compress-quality"
                    type="range"
                    min="10"
                    max="100"
                    value={Math.round(quality * 100)}
                    disabled={isProcessing}
                    onChange={(e) => {
                      setQuality(Number(e.target.value) / 100);
                      setPreset("custom");
                    }}
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600"
                  />
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-slate-700">
                    Max width
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {MAX_WIDTH_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isProcessing}
                        onClick={() => setMaxWidth(opt.value)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 ${
                          maxWidth === opt.value
                            ? "border-brand-500 bg-brand-50 text-brand-700"
                            : "border-slate-200 text-slate-600 hover:border-brand-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-slate-700">
                    Output format
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {
                      OUTPUT_OPTIONS.find((o) => o.id === outputFormat)
                        ?.description
                    }
                  </p>
                  <div className="mt-3">
                    <FormatSelector
                      formats={outputFormatsForSelector}
                      value={outputFormat}
                      onChange={setOutputFormat}
                      disabled={isProcessing}
                      columns={4}
                    />
                  </div>
                </div>

                {error && (
                  <div
                    className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
                    role="alert"
                  >
                    <AlertCircle
                      className="mt-0.5 h-5 w-5 shrink-0"
                      aria-hidden="true"
                    />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleCompress}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2
                          className="h-5 w-5 animate-spin"
                          aria-hidden="true"
                        />
                        Compressing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" aria-hidden="true" />
                        Compress Image
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleReset}
                    disabled={isProcessing}
                  >
                    <RefreshCw className="h-5 w-5" aria-hidden="true" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {status === "success" && originalUrl && resultUrl && (
            <div className="space-y-8">
              <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-center text-white shadow-lg">
                <p className="text-3xl font-bold">
                  {savedPercent > 0 ? `${savedPercent}% smaller` : "Compressed"}
                </p>
                <p className="mt-2 text-emerald-50">
                  {formatFileSize(originalFile?.size)} →{" "}
                  {formatFileSize(resultBlob?.size)}
                  {savedBytes > 0 && (
                    <span className="block text-sm">
                      Saved {formatFileSize(savedBytes)}
                    </span>
                  )}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                  <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-700">
                      Before
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(originalFile?.size)}
                    </p>
                  </div>
                  <div className="flex aspect-square items-center justify-center bg-slate-50 p-4">
                    <img
                      src={originalUrl}
                      alt="Before compression"
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full rounded-lg object-contain"
                    />
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-card ring-1 ring-indigo-100">
                  <div className="border-b border-indigo-100 bg-indigo-50 px-4 py-3">
                    <p className="text-sm font-semibold text-indigo-700">
                      After
                    </p>
                    <p className="text-xs text-indigo-600/80">
                      {formatFileSize(resultBlob?.size)} · .{resultExtension}
                    </p>
                  </div>
                  <div className="flex aspect-square items-center justify-center bg-slate-50 p-4">
                    <img
                      src={resultUrl}
                      alt="After compression"
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full rounded-lg object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" onClick={handleDownload}>
                  <Download className="h-5 w-5" aria-hidden="true" />
                  Download compressed
                </Button>
                <Button variant="secondary" size="lg" onClick={handleReset}>
                  <RefreshCw className="h-5 w-5" aria-hidden="true" />
                  Compress another
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
