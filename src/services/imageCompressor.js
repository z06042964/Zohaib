import { formatFileSize } from "./imageConverter";

export { formatFileSize };

export const COMPRESSION_PRESETS = [
  {
    id: "light",
    label: "Light",
    quality: 0.85,
    description: "Small size reduction, best quality",
  },
  {
    id: "balanced",
    label: "Balanced",
    quality: 0.7,
    description: "Recommended for most images",
  },
  {
    id: "strong",
    label: "Strong",
    quality: 0.5,
    description: "Maximum compression",
  },
];

export const MAX_WIDTH_OPTIONS = [
  { id: "original", label: "Original size", value: null },
  { id: "1920", label: "1920px", value: 1920 },
  { id: "1280", label: "1280px", value: 1280 },
  { id: "1024", label: "1024px", value: 1024 },
  { id: "800", label: "800px", value: 800 },
];

export const OUTPUT_OPTIONS = [
  {
    id: "auto",
    label: "Auto",
    description: "Best format for smallest size (WEBP/JPG)",
  },
  {
    id: "jpeg",
    label: "JPG",
    description: "Universal compatibility",
  },
  {
    id: "webp",
    label: "WEBP",
    description: "Best compression, modern browsers",
  },
  {
    id: "png",
    label: "PNG",
    description: "Keeps transparency, larger files",
  },
];

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
];

export function validateCompressorFile(file) {
  if (!file) return "Please select an image file.";
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Please upload a JPG, PNG, WEBP, GIF, or BMP image.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Image must be smaller than 20 MB.";
  }
  return null;
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image. Try a different file."));
    };
    img.src = url;
  });
}

function resolveOutputMime(fileType, outputId) {
  if (outputId === "jpeg") return "image/jpeg";
  if (outputId === "webp") return "image/webp";
  if (outputId === "png") return "image/png";

  if (fileType === "image/jpeg" || fileType === "image/jpg") {
    return "image/jpeg";
  }
  if (fileType === "image/webp") return "image/webp";
  return "image/webp";
}

function mimeToExtension(mime) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  return "png";
}

function scaleDimensions(naturalWidth, naturalHeight, maxWidth) {
  if (!maxWidth || naturalWidth <= maxWidth) {
    return { width: naturalWidth, height: naturalHeight };
  }
  const ratio = maxWidth / naturalWidth;
  return {
    width: maxWidth,
    height: Math.round(naturalHeight * ratio),
  };
}

export async function compressImage(file, options = {}) {
  const { quality = 0.7, maxWidth = null, outputFormat = "auto" } = options;

  const validationError = validateCompressorFile(file);
  if (validationError) throw new Error(validationError);

  const img = await loadImage(file);
  const { width, height } = scaleDimensions(
    img.naturalWidth,
    img.naturalHeight,
    maxWidth
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");

  const mime = resolveOutputMime(file.type, outputFormat);

  if (mime === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);

  const useQuality = mime !== "image/png";

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else
          reject(
            new Error("Compression failed. Try a different format or settings.")
          );
      },
      mime,
      useQuality ? quality : undefined
    );
  });

  const extension = mimeToExtension(mime);

  return {
    blob,
    mime,
    extension,
    dimensions: { width, height },
  };
}
