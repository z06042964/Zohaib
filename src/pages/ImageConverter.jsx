import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Loader2,
  RefreshCw,
  AlertCircle,
  FileImage,
} from "lucide-react";
import Button from "../components/ui/Button";
import ImageDropzone from "../components/tools/ImageDropzone";
import FormatSelector from "../components/tools/FormatSelector";
import {
  convertImage,
  OUTPUT_FORMATS,
  formatFileSize,
} from "../services/imageConverter";

export default function ImageConverter({ variant = "converter" }) {
  const isPngToJpg = variant === "png-to-jpg";
  const [originalFile, setOriginalFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultBlob, setResultBlob] = useState(null);
  const [outputFormat, setOutputFormat] = useState(isPngToJpg ? "jpg" : "png");
  const [quality, setQuality] = useState(0.92);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const selectedFormat = OUTPUT_FORMATS.find((f) => f.id === outputFormat);
  const showQuality = selectedFormat?.supportsQuality;
  const pageTitle = isPngToJpg ? "PNG to JPG Converter" : "Image Converter";
  const pageDescription = isPngToJpg
    ? "Convert PNG images to JPG online for smaller files and faster loading. Everything happens right in your browser."
    : "Convert images between JPG, PNG, and WEBP instantly. Fast, browser-based processing with no upload to a server.";
  const formatHeading = isPngToJpg ? "JPG output" : "Output format";
  const fileAccept = isPngToJpg
    ? "image/png"
    : "image/jpeg,image/png,image/webp,image/gif,image/bmp";
  const dropzoneHelperText = isPngToJpg
    ? "Supports PNG only - max 15 MB"
    : "Supports JPG, PNG, WEBP, GIF, BMP - max 15 MB";

  const cleanupUrls = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [originalUrl, resultUrl]);

  useEffect(() => () => cleanupUrls(), [cleanupUrls]);

  const handleFileSelect = (file) => {
    cleanupUrls();
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setResultBlob(null);
    setError(null);
    setStatus("ready");
  };

  const handleConvert = async () => {
    if (!originalFile) return;

    setError(null);
    setStatus("processing");
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
      setResultBlob(null);
    }

    try {
      const { blob } = await convertImage(
        originalFile,
        outputFormat,
        quality
      );
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
      setStatus("success");
    } catch (err) {
      setError(err.message || "Conversion failed. Please try again.");
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
    if (!resultUrl || !selectedFormat) return;
    const baseName =
      originalFile?.name?.replace(/\.[^.]+$/, "") || "converted-image";
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `${baseName}.${selectedFormat.extension}`;
    link.click();
  };

  const isProcessing = status === "processing";
  const sizeReduction =
    originalFile && resultBlob
      ? Math.round((1 - resultBlob.size / originalFile.size) * 100)
      : null;

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
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <RefreshCw
                className="h-7 w-7"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {pageTitle}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              {pageDescription}
            </p>
          </div>

          {status === "idle" && (
            <ImageDropzone
              onFileSelect={handleFileSelect}
              accept={fileAccept}
              helperText={dropzoneHelperText}
            />
          )}

          {(status === "ready" || status === "processing") && originalUrl && (
            <div className="space-y-8">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Original preview
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
                  {formatHeading}
                </h2>
                {isPngToJpg ? (
                  <p className="mt-1 text-sm text-slate-500">
                    PNG files will be converted to JPG for smaller, web-friendly
                    output.
                  </p>
                ) : (
                  <>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedFormat?.description}
                    </p>
                    <div className="mt-4">
                      <FormatSelector
                        formats={OUTPUT_FORMATS}
                        value={outputFormat}
                        onChange={setOutputFormat}
                        disabled={isProcessing}
                      />
                    </div>
                  </>
                )}

                {showQuality && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="quality"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Quality
                      </label>
                      <span className="text-sm font-medium text-brand-600">
                        {Math.round(quality * 100)}%
                      </span>
                    </div>
                    <input
                      id="quality"
                      type="range"
                      min="10"
                      max="100"
                      value={Math.round(quality * 100)}
                      disabled={isProcessing}
                      onChange={(e) =>
                        setQuality(Number(e.target.value) / 100)
                      }
                      className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Lower quality = smaller file size
                    </p>
                  </div>
                )}

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
                    onClick={handleConvert}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2
                          className="h-5 w-5 animate-spin"
                          aria-hidden="true"
                        />
                        Converting...
                      </>
                    ) : (
                      <>
                        <FileImage className="h-5 w-5" aria-hidden="true" />
                        Convert Image
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
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                  <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-700">
                      Original
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(originalFile?.size)}
                    </p>
                  </div>
                  <div className="flex aspect-square items-center justify-center bg-slate-50 p-4">
                    <img
                      src={originalUrl}
                      alt="Original"
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full rounded-lg object-contain"
                    />
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-card ring-1 ring-blue-100">
                  <div className="border-b border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-sm font-semibold text-blue-700">
                      Converted · {selectedFormat?.label}
                    </p>
                    <p className="text-xs text-blue-600/80">
                      {formatFileSize(resultBlob?.size)}
                      {sizeReduction !== null && sizeReduction > 0 && (
                        <span className="ml-1">
                          ({sizeReduction}% smaller)
                        </span>
                      )}
                      {sizeReduction !== null && sizeReduction < 0 && (
                        <span className="ml-1">
                          ({Math.abs(sizeReduction)}% larger)
                        </span>
                      )}
                    </p>
                  </div>
                  <div
                    className="flex aspect-square items-center justify-center bg-[length:16px_16px] p-4"
                    style={{
                      backgroundImage:
                        outputFormat === "jpg"
                          ? undefined
                          : "linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)",
                      backgroundPosition:
                        outputFormat === "jpg"
                          ? undefined
                          : "0 0, 0 8px, 8px -8px, -8px 0",
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <img
                      src={resultUrl}
                      alt="Converted result"
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
                  Download {selectedFormat?.label}
                </Button>
                <Button variant="secondary" size="lg" onClick={handleReset}>
                  <RefreshCw className="h-5 w-5" aria-hidden="true" />
                  Convert another
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
