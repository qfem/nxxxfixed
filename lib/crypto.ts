export function randomBytes(length: number) { const bytes = new Uint8Array(length); crypto.getRandomValues(bytes); return bytes; }
export function hex(bytes: Uint8Array) { return Array.from(bytes, b => b.toString(16).padStart(2,'0')).join(''); }
const enc = new TextEncoder();
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const material = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', salt, iterations:210000, hash:'SHA-256' }, material, 256);
  return `pbkdf2$210000$${hex(salt)}$${hex(new Uint8Array(bits))}`;
}
export async function verifyPassword(password: string, stored: string) {
  const [scheme, rounds, saltHex, expected] = stored.split('$');
  if (scheme !== 'pbkdf2' || !rounds || !saltHex || !expected) return false;
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(x => parseInt(x,16)));
  const material = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', salt, iterations:Number(rounds), hash:'SHA-256' }, material, 256);
  const actual = hex(new Uint8Array(bits));
  return actual.length === expected.length && [...actual].every((c,i)=>c===expected[i]);
}
