import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const adminKey = process.env.ADMIN_KEY || "cdapp-admin-203332423423324";
  if (body.key !== adminKey) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  const { campaign, codes } = body;
  if (!campaign || !Array.isArray(codes) || codes.length === 0) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing campaign or codes array" }),
    };
  }

  const cleanCodes = codes
    .map((c) => (typeof c === "string" ? c.trim() : ""))
    .filter((c) => c.length > 0);

  if (cleanCodes.length === 0) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "No valid codes provided" }),
    };
  }

  try {
    const store = getStore("offer-codes");
    const raw = await store.get(campaign);
    const data = raw ? JSON.parse(raw) : { codes: [], claims: [] };

    const existingSet = new Set(data.codes);
    const newCodes = cleanCodes.filter((c) => !existingSet.has(c));
    data.codes.push(...newCodes);

    await store.set(campaign, JSON.stringify(data));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        campaign,
        added: newCodes.length,
        totalCodes: data.codes.length,
        totalClaimed: data.claims.length,
        remaining: data.codes.length - data.claims.length,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
