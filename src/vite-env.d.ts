interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  /** Optional — enables direct-to-Cloudinary image upload (see helpers/upload.ts). */
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
