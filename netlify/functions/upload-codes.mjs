import { getStore } from "@netlify/blobs";

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const adminKey = process.env.ADMIN_KEY || "cdapp-admin-203332423423324";
  if (body.key !== adminKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { campaign, codes } = body;
  if (!campaign || !Array.isArray(codes) || codes.length === 0) {
    return new Response(
      JSON.stringify({ error: "Missing campaign or codes array" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Clean codes: trim whitespace, remove empty lines.
  const cleanCodes = codes
    .map((c) => (typeof c === "string" ? c.trim() : ""))
    .filter((c) => c.length > 0);

  if (cleanCodes.length === 0) {
    return new Response(JSON.stringify({ error: "No valid codes provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const store = getStore("offer-codes");

  // Load existing campaign data or create new.
  const raw = await store.get(campaign);
  const data = raw
    ? JSON.parse(raw)
    : { codes: [], claims: [] };

  // Avoid duplicates: only add codes not already in the pool.
  const existingSet = new Set(data.codes);
  const newCodes = cleanCodes.filter((c) => !existingSet.has(c));
  data.codes.push(...newCodes);

  await store.set(campaign, JSON.stringify(data));

  return new Response(
    JSON.stringify({
      success: true,
      campaign,
      added: newCodes.length,
      totalCodes: data.codes.length,
      totalClaimed: data.claims.length,
      remaining: data.codes.length - data.claims.length,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export const config = {
  path: "/api/upload-codes",
};
