const ADMIN_KEY = "cdapp-admin-203332423423324";

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (key !== ADMIN_KEY) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kv = env.OFFER_CODES;

  // List all keys in KV.
  const list = await kv.list();
  const campaigns = [];

  for (const { name } of list.keys) {
    const raw = await kv.get(name);
    if (!raw) continue;
    const data = JSON.parse(raw);
    const total = data.codes.length;
    const claimed = data.claims.length;

    campaigns.push({
      name,
      total,
      claimed,
      remaining: total - claimed,
      recentClaims: data.claims.slice(-10).reverse(),
    });
  }

  return Response.json({ campaigns });
}
