# Connect the contact form to Google Sheets

The browser posts only to `/api/contact`. Next.js then POSTs to your Apps Script web app. A 302 redirect to `script.googleusercontent.com` is normal. The server treats the enquiry as stored **only** when the final JSON body includes `stored: true` and either `success: true` or `ok: true`. A bare HTTP 200 is not enough.

## 1. Shared secret (required)

Generate a long random string. You will use the **same** value in two places:

- Apps Script → **Project Settings → Script properties** → `WEBHOOK_SECRET`
- Server env var `GOOGLE_SHEETS_WEBHOOK_SECRET`

Do not put this value in frontend code or git.

If you update `scripts/google-sheets-contact.gs` and redeploy, you **must** set `WEBHOOK_SECRET` first. The updated script rejects requests when that property is missing.

Do **not** click Run on `doPost` in the Apps Script editor. That runs without a POST event and throws `Cannot read properties of undefined (reading 'postData')`. Use `initializeSheet` to test spreadsheet access.

`DEADLINE_EXCEEDED` comes from Google Properties Service or Sheets reads. The updated script reads properties once (with retries) and only `appendRow`s on the hot path. If it still appears, wait and retry once; do not spam-submit.

The currently deployed web app may still accept posts without a token until you deploy a new Apps Script version. Set the secret before that redeploy.

## 2. Apps Script properties and redeploy

1. Open the Apps Script project attached to **AppLattice — Contact Inquiries**.
2. **Project Settings → Script properties**
   - `SPREADSHEET_ID` — from the sheet URL (`/d/THIS_ID/edit`)
   - `WEBHOOK_SECRET` — the shared secret above
3. If you changed the `.gs` source, **Deploy → Manage deployments → Edit (pencil) → New version → Deploy**.
4. Keep **Execute as: Me** and **Who has access: Anyone**.

“Anyone” is required so the Next.js server can POST without a Google login. That is **not** strong security. The shared secret is the practical mitigation. Keep the spreadsheet private.

## 3. Server environment

Set **server-only** variables (never `NEXT_PUBLIC_…`):

- `GOOGLE_SHEETS_WEB_APP_URL` — the web app `/exec` URL
- `GOOGLE_SHEETS_WEBHOOK_SECRET` — same as `WEBHOOK_SECRET`

**Local:** create `.env.local` in the AppLattice project root (gitignored). Restart `next dev` after changing it.

**Vercel:** Project → Settings → Environment Variables → add both for **Production** (and Preview if you test there) → Redeploy.

## 4. Confirm a real row

1. Submit a test enquiry on the contact form.
2. Open the **Contact Inquiries** worksheet.
3. Confirm a new row with Status `New`.

If the site shows success but no row appears, the JSON confirmation did not match a write — check the Apps Script execution log, then the env vars and `WEBHOOK_SECRET`.
