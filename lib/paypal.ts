import { env } from './cloudflare';
const base = (e: Awaited<ReturnType<typeof env>>) => e.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
export async function paypalRequest(path: string, init: RequestInit = {}) {
  const e = await env();
  const auth = btoa(`${e.PAYPAL_CLIENT_ID}:${e.PAYPAL_CLIENT_SECRET}`);
  const tokenRes = await fetch(`${base(e)}/v1/oauth2/token`, { method:'POST', headers:{ Authorization:`Basic ${auth}`, 'Content-Type':'application/x-www-form-urlencoded' }, body:'grant_type=client_credentials' });
  if (!tokenRes.ok) throw new Error('Unable to authenticate with PayPal');
  const token = await tokenRes.json() as {access_token:string};
  const res = await fetch(`${base(e)}${path}`, { ...init, headers:{ Authorization:`Bearer ${token.access_token}`, 'Content-Type':'application/json', ...(init.headers||{}) } });
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error((data as {message?:string}).message || 'PayPal request failed');
  return data as Record<string, any>;
}
