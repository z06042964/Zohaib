import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Loader2,
  RefreshCw,
  Scissors,
  AlertCircle,
} from "lucide-react";
import Button from "../components/ui/Button";
import ImageDropzone from "../components/tools/ImageDropzone";
import { removeBackground } from "../services/removeBg";

export default function BackgroundRemover() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | processing | success | error
  const [error, setError] = useState(null);

  const cleanupUrls = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [originalUrl, resultUrl]);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  const processImage = async (file) => {
    cleanupUrls();
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setError(null);
    setStatus("processing");

    try {
      const resultBlob = await removeBackground(file);
      const url = URL.createObjectURL(resultBlob);
      setResultUrl(url);
      setStatus("success");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    cleanupUrls();
    setOriginalFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setError(null);
    setStatus("idle");
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `no-bg-${originalFile?.name?.replace(/\.[^.]+$/, "") || "image"}.png`;
    link.click();
  };

  const isProcessing = status === "processing";

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
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <Scissors className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Background Remover
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Upload an image and remove the background instantly with AI. Download
              a transparent PNG in seconds.
            </p>
          </div>

          {status === "idle" && (
            <ImageDropzone onFileSelect={processImage} disabled={isProcessing} />
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-soft">
              <Loader2
                className="h-12 w-12 animate-spin text-brand-600"
                aria-hidden="true"
              />
              <p className="mt-4 text-lg font-semibold text-slate-900">
                Removing background...
              </p>
              <p className="mt-2 text-sm text-slate-500">
                This usually takes a few seconds
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-6">
              <div
                className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Processing failed</p>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
              <ImageDropzone onFileSelect={processImage} />
              <div className="text-center">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Start over
                </Button>
              </div>
            </div>
          )}

          {status === "success" && originalUrl && resultUrl && (
            <div className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                  <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-700">Original</p>
                  </div>
                  <div
                    className="flex aspect-square items-center justify-center bg-[length:16px_16px] p-4"
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)",
                      backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
                      backgroundColor: "#fff",
                    }}
                  >
                    <img
                      src={originalUrl}
                      alt="Original upload"
                      className="max-h-full max-w-full rounded-lg object-contain shadow-sm"
                    />
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-card ring-1 ring-brand-100">
                  <div className="border-b border-brand-100 bg-brand-50 px-4 py-3">
                    <p className="text-sm font-semibold text-brand-700">
                      Background removed
                    </p>
                  </div>
                  <div
                    className="flex aspect-square items-center justify-center bg-[length:16px_16px] p-4"
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)",
                      backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
                      backgroundColor: "#fff",
                    }}
                  >
                    <img
                      src={resultUrl}
                      alt="Background removed result"
                      className="max-h-full max-w-full rounded-lg object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" onClick={handleDownload}>
                  <Download className="h-5 w-5" aria-hidden="true" />
                  Download PNG
                </Button>
                <Button variant="secondary" size="lg" onClick={handleReset}>
                  <RefreshCw className="h-5 w-5" aria-hidden="true" />
                  Upload another
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
