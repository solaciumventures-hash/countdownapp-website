export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const campaign = body.campaign;
  if (!campaign || typeof campaign !== "string") {
    return Response.json({ error: "Missing campaign" }, { status: 400 });
  }

  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const kv = env.OFFER_CODES;
  const raw = await kv.get(campaign);

  if (!raw) {
    return Response.json({ error: "Campaign not found" }, { status: 404 });
  }

  const data = JSON.parse(raw);
  const claimedCodes = new Set(data.claims.map((c) => c.code));

  // Check if this IP already claimed.
  const existingClaim = data.claims.find((c) => c.ip === ip);
  if (existingClaim) {
    return Response.json({
      success: true,
      code: existingClaim.code,
      alreadyClaimed: true,
    });
  }

  // Find next unclaimed code.
  const nextCode = data.codes.find((code) => !claimedCodes.has(code));
  if (!nextCode) {
    return Response.json({ soldOut: true });
  }

  // Claim the code.
  data.claims.push({
    code: nextCode,
    ip,
    claimedAt: new Date().toISOString(),
  });

  await kv.put(campaign, JSON.stringify(data));

  return Response.json({
    success: true,
    code: nextCode,
    alreadyClaimed: false,
  });
}
