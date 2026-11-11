export interface Env {
  DB: D1Database;
  AI: Ai;
  SESSION_SECRET: string;
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  PAYPAL_ENV?: string;
  PAYPAL_WEBHOOK_ID?: string;
  PAYPAL_PLAN_PRO?: string;
  PAYPAL_PLAN_PREMIUM?: string;
  APP_URL?: string;
}
