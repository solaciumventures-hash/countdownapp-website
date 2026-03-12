import { getStore } from "@netlify/blobs";

export default async (request, context) => {
  // Only accept POST.
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

  const campaign = body.campaign;
  if (!campaign || typeof campaign !== "string") {
    return new Response(JSON.stringify({ error: "Missing campaign" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ip =
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const store = getStore("offer-codes");

  // Load campaign data.
  const raw = await store.get(campaign);
  if (!raw) {
    return new Response(
      JSON.stringify({ error: "Campaign not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const data = JSON.parse(raw);
  // data = { codes: ["CODE1", ...], claims: [{ code, ip, claimedAt }, ...] }

  const claimedCodes = new Set(data.claims.map((c) => c.code));

  // Check if this IP already claimed a code in this campaign.
  const existingClaim = data.claims.find((c) => c.ip === ip);
  if (existingClaim) {
    return new Response(
      JSON.stringify({
        success: true,
        code: existingClaim.code,
        alreadyClaimed: true,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  // Find the next unclaimed code.
  const nextCode = data.codes.find((code) => !claimedCodes.has(code));
  if (!nextCode) {
    return new Response(
      JSON.stringify({ soldOut: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  // Claim the code.
  data.claims.push({
    code: nextCode,
    ip,
    claimedAt: new Date().toISOString(),
  });

  await store.set(campaign, JSON.stringify(data));

  return new Response(
    JSON.stringify({ success: true, code: nextCode, alreadyClaimed: false }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export const config = {
  path: "/api/claim-code",
};
