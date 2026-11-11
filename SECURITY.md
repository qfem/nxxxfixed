# Security notes

- Never commit `.dev.vars`, PayPal credentials, or `SESSION_SECRET`.
- Use HTTPS in production and keep session cookies HTTP-only and SameSite=Lax.
- Rotate secrets if exposed.
- Add rate limiting, email verification, password reset, CSRF/origin protections and bot mitigation before public launch.
- PayPal coin capture validates the signed-in user, package reference, currency and exact expected amount before crediting coins. Do not trust client-provided prices or coin amounts.
- PayPal subscription status changes are accepted only after PayPal webhook signature verification.
- Have the implementation independently security-reviewed before handling real customer data or payments.
