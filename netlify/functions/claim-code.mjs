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

  const campaign = body.campaign;
  if (!campaign || typeof campaign !== "string") {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing campaign" }),
    };
  }

  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    "unknown";

  try {
    const store = getStore("offer-codes");
    const raw = await store.get(campaign);

    if (!raw) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Campaign not found" }),
      };
    }

    const data = JSON.parse(raw);
    const claimedCodes = new Set(data.claims.map((c) => c.code));

    // Check if this IP already claimed.
    const existingClaim = data.claims.find((c) => c.ip === ip);
    if (existingClaim) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: true,
          code: existingClaim.code,
          alreadyClaimed: true,
        }),
      };
    }

    // Find next unclaimed code.
    const nextCode = data.codes.find((code) => !claimedCodes.has(code));
    if (!nextCode) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soldOut: true }),
      };
    }

    // Claim the code.
    data.claims.push({
      code: nextCode,
      ip,
      claimedAt: new Date().toISOString(),
    });

    await store.set(campaign, JSON.stringify(data));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        code: nextCode,
        alreadyClaimed: false,
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
