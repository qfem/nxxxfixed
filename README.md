# NAI Chat — Cloudflare AI starter

A dark black-and-purple AI chat SaaS starter built with Next.js App Router, TypeScript/TSX, OpenNext for Cloudflare Workers, D1, Workers AI, and PayPal checkout.

## Included

- Responsive NAI Chat landing page, login, registration, pricing, and dashboard.
- Email/password authentication using PBKDF2-SHA256 password hashes, signed HTTP-only session cookies, and D1-backed sessions.
- D1 wallet with 100 welcome coins; AI requests cost 5 coins.
- Workers AI chat endpoint using `@cf/meta/llama-3.1-8b-instruct`.
- PayPal one-time checkout for 500 / 1,500 / 4,000 / 10,000 coin packages. Coins are credited only after server-side PayPal capture verification.
- PayPal subscription approval routes and webhook handling for activation, cancellation and suspension.

## 1. Requirements

- Node.js 20.19+ (or a currently supported Node LTS)
- A Cloudflare account with Workers, D1 and Workers AI enabled
- A PayPal Developer account and REST app

## 2. Install and create D1

```bash
npm install
npx wrangler d1 create nai-invite
```

Copy the returned database ID into `wrangler.jsonc` replacing `REPLACE_WITH_D1_DATABASE_ID`, then apply the schema:

```bash
npx wrangler d1 execute nai-invite --local --file=./db/schema.sql
npx wrangler d1 execute nai-invite --remote --file=./db/schema.sql
```

For local development, copy `.dev.vars.example` to `.dev.vars` and fill in values. Generate a strong session secret, for example with `openssl rand -base64 48`.

```bash
cp .dev.vars.example .dev.vars
npm run dev
```

## 3. PayPal setup

1. Create a PayPal REST app in the Developer Dashboard.
2. Put the sandbox client ID and secret in `.dev.vars` for local testing.
3. Create two recurring billing plans in PayPal: Pro ($9.99/month) and Premium ($19.99/month). Add their plan IDs as `PAYPAL_PLAN_PRO` and `PAYPAL_PLAN_PREMIUM`.
4. Configure a PayPal webhook pointing to `https://YOUR_DOMAIN/api/paypal/webhook` and subscribe to `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`, and `BILLING.SUBSCRIPTION.SUSPENDED`. Save its webhook ID as `PAYPAL_WEBHOOK_ID`.
5. Use `PAYPAL_ENV=sandbox` for testing. Change to `live` only after live credentials, plans and webhook have been configured and tested.

Set Worker secrets (do not commit secrets):

```bash
npx wrangler secret put SESSION_SECRET
npx wrangler secret put PAYPAL_CLIENT_ID
npx wrangler secret put PAYPAL_CLIENT_SECRET
npx wrangler secret put PAYPAL_WEBHOOK_ID
npx wrangler secret put PAYPAL_PLAN_PRO
npx wrangler secret put PAYPAL_PLAN_PREMIUM
```

Set non-secret Worker variables such as `PAYPAL_ENV` and `APP_URL` in `wrangler.jsonc` under `vars`, or configure them in the Cloudflare dashboard. `APP_URL` must be your canonical HTTPS origin in production.

## 4. Deploy

```bash
npx wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts
npm run deploy
```

Follow the OpenNext Cloudflare deployment output and add any required bindings/secrets in the Cloudflare dashboard. Confirm D1 is bound as `DB` and Workers AI as `AI`.

## Important before public launch

This is a working starter scaffold, not a finished audited payment business. Before accepting real money:

- Configure PayPal live credentials, recurring plans and webhook; test successful, cancelled, duplicate and failed payments in sandbox.
- Add a robust account recovery/email verification flow, rate limiting, abuse controls, bot protection, CSRF/origin checks, privacy policy, terms, refund/cancellation policy, and support contact.
- Review the AI model availability and pricing in your Cloudflare account. Adjust coin cost and package economics to actual inference costs.
- Subscription activation is recorded by webhook, but recurring monthly coin grants, subscription entitlement enforcement, and customer self-service cancellation are not implemented yet. The UI marks these as planned features rather than promising them.
- Add a durable idempotent webhook event ledger and reconcile payment/subscription state before production.
- Configure Cloudflare Turnstile or equivalent protections on registration and login; apply per-user/IP rate limits.
- Review local consumer/payment requirements and PayPal eligibility for your business and country.

## Product defaults

- Free registration: 100 coins.
- AI chat: 5 coins per successful response.
- Coin package prices: Starter 500/$2.99, Standard 1,500/$6.99, Advanced 4,000/$14.99, Ultimate 10,000/$29.99.
- Subscription display: Free $0, Pro $9.99/month, Premium $19.99/month. Configure matching PayPal recurring plans before enabling.
