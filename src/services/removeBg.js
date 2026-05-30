const REMOVEBG_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://api.remove.bg/v1.0/removebg"
    : "/api/removebg";

const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export function validateImageFile(file) {
  if (!file) {
    return "Please select an image file.";
  }
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Please upload a JPG, PNG, or WEBP image.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Image must be smaller than 12 MB.";
  }
  return null;
}

async function parseErrorMessage(response) {
  try {
    const data = await response.json();
    if (data.errors?.length) {
      return data.errors.map((e) => e.title || e.detail).join(" ");
    }
    return data.error || data.message;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

export async function removeBackground(imageFile) {
  const validationError = validateImageFile(imageFile);
  if (validationError) {
    throw new Error(validationError);
  }

  const formData = new FormData();
  formData.append("image_file", imageFile);
  formData.append("size", "auto");

  const headers = {};
  if (process.env.NODE_ENV === "production") {
    const apiKey = process.env.REACT_APP_REMOVEBG_API_KEY;
    if (!apiKey) {
      throw new Error("API key is not configured. Add REACT_APP_REMOVEBG_API_KEY to your environment.");
    }
    headers["X-Api-Key"] = apiKey;
  }

  const response = await fetch(REMOVEBG_ENDPOINT, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message || "Failed to remove background. Please try again.");
  }

  return response.blob();
}
