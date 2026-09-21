/**
 * The backend has no upload endpoint — images are plain URL strings. This
 * optional helper uploads straight from the browser to Cloudinary (unsigned
 * preset) and hands back a URL to store. It never touches the backend API.
 *
 * Enabled only when both env vars are set; otherwise the UI falls back to a
 * paste-a-URL input.
 */
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const isImageUploadConfigured = Boolean(cloudName && uploadPreset);

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

export const uploadImage = async (file: File): Promise<string> => {
  if (!cloudName || !uploadPreset) {
    throw new Error('Image upload is not configured');
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files can be uploaded');
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error('Image must be smaller than 5 MB');
  }

  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body },
  );

  if (!response.ok) {
    throw new Error('Image upload failed. Please try again.');
  }

  const json = (await response.json()) as { secure_url?: string };
  if (!json.secure_url) {
    throw new Error('Image upload did not return a URL');
  }
  return json.secure_url;
};
