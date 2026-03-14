const ADMIN_KEY = "cdapp-admin-203332423423324";

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.key !== ADMIN_KEY) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { campaign, codes } = body;
  if (!campaign || !Array.isArray(codes) || codes.length === 0) {
    return Response.json(
      { error: "Missing campaign or codes array" },
      { status: 400 }
    );
  }

  const cleanCodes = codes
    .map((c) => (typeof c === "string" ? c.trim() : ""))
    .filter((c) => c.length > 0);

  if (cleanCodes.length === 0) {
    return Response.json({ error: "No valid codes provided" }, { status: 400 });
  }

  const kv = env.OFFER_CODES;
  const raw = await kv.get(campaign);
  const data = raw ? JSON.parse(raw) : { codes: [], claims: [] };

  const existingSet = new Set(data.codes);
  const newCodes = cleanCodes.filter((c) => !existingSet.has(c));
  data.codes.push(...newCodes);

  await kv.put(campaign, JSON.stringify(data));

  return Response.json({
    success: true,
    campaign,
    added: newCodes.length,
    totalCodes: data.codes.length,
    totalClaimed: data.claims.length,
    remaining: data.codes.length - data.claims.length,
  });
}
