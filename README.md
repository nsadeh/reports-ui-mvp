## Run locally

1. Clone repo
2. Copy `.env.example` to `.env.local` and fill in the values
3. Run `npm run dev`

At minimum you need `ANTHROPIC_API_KEY` for full chat functionality (otherwise the chat degrades to `qa-fallback.json` pairs). The password variables are only enforced by the middleware — if you leave them unset in local dev you'll be redirected to `/login` and unable to sign in, so set at least `SHARED_PASSWORD_INTERNAL` locally.

## Deploy to Vercel (single-customer access)

1. Push this repo to GitHub.
2. In Vercel, "Add New Project" → import the repo. Framework preset: Next.js. No build overrides needed.
3. Add environment variables (Settings → Environment Variables, apply to Production):
   - `ANTHROPIC_API_KEY`
   - `SHARED_PASSWORD_INTERNAL` — your team's password (full access)
   - `SHARED_PASSWORD_CUSTOMER` — the password you give to the customer
   - `CUSTOMER_REPORT_IDS` — comma-separated list of report slugs the customer may view. The first entry is their landing page after login. (e.g. `tnf-alpha-landscape-2026-03-10,alzheimer-landscape-2026-03-31`)
4. Deploy. Visit the production URL — you'll be redirected to `/login`. Enter either password to verify.
5. Share the production URL + customer password out-of-band (email/Slack).

### What the customer sees
- They enter the customer password on `/login`.
- They're redirected to the first report in `CUSTOMER_REPORT_IDS` and can chat with it.
- They can navigate directly to any other report in the list via URL.
- Every other route (dashboard, reports list, non-allowlisted reports, commission) redirects them back to their first allowed report.
- Chat API is rate-limited to 30 messages/hour per session.

### Rotating access
Change `SHARED_PASSWORD_CUSTOMER` in Vercel and redeploy. Old cookie keeps working until it expires (30 days); to force re-login immediately, rotate the cookie name constant in `proxy.ts` and `app/api/login/route.ts`.
