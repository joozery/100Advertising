# 100Advertising

Next.js landing page and admin dashboard with MongoDB and Cloudflare R2.

## Local setup

```sh
npm install
npm run admin:password
npm run dev
```

Copy `.env.example` to `.env.local`, then replace `YOUR_STRONG_PASSWORD` in `MONGODB_URI` with the real database password. URL-encode special characters in the password. `npm run admin:password` prompts for the admin email and a hidden password, then stores the account and its scrypt password hash in MongoDB. Restart Next.js after changing environment variables.

Open `/admin` to manage works and services. The public landing page retains its original content until MongoDB is configured. Run `npm run db:seed` to upload all starter images to R2 and seed works, services and site settings in MongoDB. The command backs up current content in the ignored `.seed-backups` folder, preserves existing edited records, uploads local images to deterministic R2 keys and verifies their public URLs before updating database references. Missing starter records are inserted; running this command again restores deleted starter IDs. A configured database is the source of truth, including an empty collection.

## Environment

See `.env.example` for all variables. Keep `.env.local` private.

- `MONGODB_URI`, `MONGODB_DB`: database connection and database name (`100ads`). The database account needs read/write and index creation permissions for this database. Session and login attempt collections use TTL indexes.
- Admin accounts and password hashes are stored in MongoDB (`admin_users`). Run `npm run admin:password` to create or reset an administrator; this does not write login credentials into environment files. Changing a password invalidates previous sessions.
- `APP_URL`: exact browser origin, for example `https://100advertising.com`. Optional additional trusted origin for write requests. The current request origin and the project’s Vercel deployment/branch/production domains are also accepted. Production accepts HTTPS origins only and requires HTTPS for secure session cookies.
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`: R2 S3 API credentials scoped to the image bucket with object read/write permission.
- `R2_PUBLIC_URL`: HTTPS custom domain connected to the bucket, or an enabled public `r2.dev` URL. Images must be publicly readable through this URL.

Uploads go through the protected Next.js API to R2, so bucket browser CORS configuration is not needed. JPG, PNG and WebP files up to 4 MB are decoded, limited to 40 million pixels, resized within 2400×2400 and stored as WebP. The admin uses image uploads only, with no image URL input. Gallery ordering and cover selection are independent. Removing an image from a gallery or deleting a record removes its reference; the R2 object remains to avoid deleting shared images.

## Admin capabilities

- Add, edit, delete, search, order and publish/hide works and services.
- Per-work gallery with multiple uploads, cover selection, reorder and removal.
- Service icon/color selection.
- Cookie sessions, protected APIs, same-origin write requests and persistent login throttling.

Hero text, contact information, logos, favicon and QR image are seeded in the `settings` collection under `key: "site"`; the landing page reads these settings. Edit them under `/admin/settings/hero`, `/admin/settings/branding`, `/admin/settings/sections`, `/admin/settings/process` and `/admin/settings/contact`. Process steps and navigation labels are also editable. Administrators can manage accounts and roles at `/admin/users`.

## Verification

```sh
npm test
npm run lint
npm run build
```

Live database and bucket verification requires real environment credentials. Automated tests cover image validation, content validation and password verification.

Driver references: [MongoDB Node driver](https://www.mongodb.com/docs/drivers/node/current/connect/mongoclient/), [Cloudflare R2 S3 API](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/).
