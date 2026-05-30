export const OUTPUT_FORMATS = [
  {
    id: "jpg",
    label: "JPG",
    mime: "image/jpeg",
    extension: "jpg",
    supportsQuality: true,
    description: "Smaller file size, no transparency",
  },
  {
    id: "png",
    label: "PNG",
    mime: "image/png",
    extension: "png",
    supportsQuality: false,
    description: "Lossless, supports transparency",
  },
  {
    id: "webp",
    label: "WEBP",
    mime: "image/webp",
    extension: "webp",
    supportsQuality: true,
    description: "Modern format, great compression",
  },
];

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
];

export function validateConverterFile(file) {
  if (!file) return "Please select an image file.";
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Please upload a JPG, PNG, WEBP, GIF, or BMP image.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Image must be smaller than 15 MB.";
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

function getFormatConfig(formatId) {
  const config = OUTPUT_FORMATS.find((f) => f.id === formatId);
  if (!config) throw new Error("Invalid output format.");
  return config;
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function convertImage(file, formatId, quality = 0.92) {
  const validationError = validateConverterFile(file);
  if (validationError) throw new Error(validationError);

  const format = getFormatConfig(formatId);
  const img = await loadImage(file);

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");

  if (formatId === "jpg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("Conversion failed. Try another format or image."));
      },
      format.mime,
      format.supportsQuality ? quality : undefined
    );
  });

  return { blob, format };
}
