# Contact verification worker

Cloudflare Worker behind the site's "Contact Me" section. The page sends the
GotCHA token here, the worker verifies it with GotCHA's `siteverify` API using
the secret key, and only then returns the contact address. Neither the secret
key nor the address is ever shipped in the site bundle or committed.

```
browser ──token──▶ worker ──secret + token──▶ api.gotcha.land/api/siteverify
        ◀─email───        ◀──{ success }──────
```

## Deploy

```bash
cd worker
npm install
npx wrangler login                       # one-time, opens the browser
npx wrangler secret put GOTCHA_SECRET    # secret key from dashboard.gotcha.land
npx wrangler secret put CONTACT_EMAIL    # the address to reveal
npm run deploy                           # prints https://portfolio-contact.<you>.workers.dev
```

Then paste the printed URL into `CONTACT_API_URL` in
`src/app/contact/contact.ts` and rebuild the site.

If the site is served from a custom domain, add it to `ALLOWED_ORIGINS` in
`wrangler.toml` and redeploy.

## Local development

Create `worker/.dev.vars` (gitignored):

```
GOTCHA_SECRET=your-secret-key
CONTACT_EMAIL=you@example.com
```

Run `npm run dev` (serves on http://localhost:8787) and temporarily point
`CONTACT_API_URL` at it.

## Responses

| Status | Body | Meaning |
| ------ | ---- | ------- |
| 200 | `{ "email": "..." }` | Token verified |
| 400 | `{ "error": "bad_request" }` | Missing or malformed token |
| 403 | `{ "error": "forbidden_origin" }` | Origin not in `ALLOWED_ORIGINS` |
| 403 | `{ "error": "captcha_failed", "codes": [...] }` | GotCHA rejected the token (invalid, expired, reused, or solved on another site) |
| 500 | `{ "error": "not_configured" }` | A secret is missing |
| 502 | `{ "error": "verify_unavailable" }` | GotCHA unreachable or returned no result (also happens with a wrong secret key) |
