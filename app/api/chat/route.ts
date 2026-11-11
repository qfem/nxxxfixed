let _client: Promise<Client> | null = null;
function getClient() {
  if (!_client) _client = createClient(); // returns a promise, no top-level await
  return _client;
}

export async function POST(req: Request) {
  const client = await getClient();
  ...
}