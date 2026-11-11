import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { Env } from './types';
export async function env(): Promise<Env> {
  const context = await getCloudflareContext({ async: true });
  return context.env as unknown as Env;
}
