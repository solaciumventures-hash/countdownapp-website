import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const key = event.queryStringParameters?.key;
  const adminKey = process.env.ADMIN_KEY || "cdapp-admin-203332423423324";

  if (key !== adminKey) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  try {
    const store = getStore("offer-codes");
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

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaigns }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
