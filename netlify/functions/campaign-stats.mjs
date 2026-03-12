import { getStore } from "@netlify/blobs";

export default async (request) => {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const adminKey = process.env.ADMIN_KEY || "cdapp-admin-203332423423324";

  if (key !== adminKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const store = getStore("offer-codes");

  // List all campaigns in the store.
  const { blobs } = await store.list();
  const campaigns = [];

  for (const blob of blobs) {
    const raw = await store.get(blob.key);
    if (!raw) continue;
    const data = JSON.parse(raw);
    const total = data.codes.length;
    const claimed = data.claims.length;

    campaigns.push({
      name: blob.key,
      total,
      claimed,
      remaining: total - claimed,
      recentClaims: data.claims.slice(-10).reverse(),
    });
  }

  return new Response(JSON.stringify({ campaigns }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = {
  path: "/api/campaign-stats",
};
