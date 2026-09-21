# link-vault-admin

Admin panel for the **Pahadi Shilpkar** storefront: categories, products, testimonial moderation, and the admin's own account.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL (see .env.development / .env.production)
npm run dev            # http://localhost:5173
```

The backend allows a single CORS origin (`CLIENT_URL`). Run this panel on `http://localhost:5173` locally unless the backend has been changed to allow another origin.

Optional: set `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` to enable direct browser uploads on image fields. Without them, image fields accept pasted URLs only (the backend has no upload endpoint).

## Structure

```
src/
  api/            axios client + central 401/403/429 + validation-error parsing
  api/services/   one module per backend resource (auth, categories, products, testimonials)
  hooks/          TanStack Query hooks per resource (queries, mutations, optimistic toggles)
  types/api.ts    backend contract types (mirrors the API exactly)
  helpers/        form error mapping, formatting, optional image upload
  components/     ui (shadcn-style primitives), custom (composite), dialogs, layouts
  pages/          private (dashboard, categories, products, settings) and public (auth)
  store/          zustand stores (auth, appearance, sidebar, rate limit)
```
