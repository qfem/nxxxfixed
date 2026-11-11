import { cookies } from 'next/headers';
import { env } from './cloudflare';
import { randomBytes, hex } from './crypto';

const COOKIE = 'nai_session';
const encoder = new TextEncoder();
async function key(secret: string) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign','verify']);
}
async function sign(value: string, secret: string) {
  const sig = await crypto.subtle.sign('HMAC', await key(secret), encoder.encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
export async function createSession(userId: string) {
  const e = await env();
  const id = hex(randomBytes(32));
  const expires = Math.floor(Date.now()/1000) + 60*60*24*30;
  await e.DB.prepare('INSERT INTO sessions (id,user_id,expires_at) VALUES (?,?,?)').bind(id,userId,expires).run();
  const value = `${id}.${expires}`;
  const jar = await cookies();
  jar.set(COOKIE, `${value}.${await sign(value,e.SESSION_SECRET)}`, { httpOnly:true, secure: process.env.NODE_ENV === 'production', sameSite:'lax', path:'/', expires:new Date(expires*1000) });
}
export async function currentUser() {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  const parts = raw.split('.');
  if (parts.length !== 3) return null;
  const [id, expiresRaw, signature] = parts;
  const expires = Number(expiresRaw);
  const e = await env();
  if (!Number.isFinite(expires) || expires < Date.now()/1000) return null;
  const expected = await sign(`${id}.${expiresRaw}`, e.SESSION_SECRET);
  if (signature !== expected) return null;
  const row = await e.DB.prepare('SELECT u.id,u.email FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id=? AND s.expires_at>?').bind(id,Math.floor(Date.now()/1000)).first<{id:string,email:string}>();
  return row;
}
export async function destroySession() {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (raw) { const id = raw.split('.')[0]; const e = await env(); await e.DB.prepare('DELETE FROM sessions WHERE id=?').bind(id).run(); }
  jar.delete(COOKIE);
}
