const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Countdown — Claim 3 Months Free</title>
  <meta name="description" content="Get 3 months of Countdown Premium for free. Beautiful countdown timers with photos, widgets, and sharing.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --accent: #0D6B6E;
      --accent-light: #A8D5E2;
      --bg: #0a1a1a;
      --surface: rgba(255, 255, 255, 0.06);
      --surface-border: rgba(255, 255, 255, 0.08);
      --on-surface: #F0F5F5;
      --on-surface-variant: #9BB5B5;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--on-surface);
      min-height: 100vh;
      overflow-x: hidden;
    }

    .bg-gradient {
      position: fixed;
      inset: 0;
      z-index: -1;
      background:
        radial-gradient(ellipse 600px 600px at 20% 10%, rgba(13, 107, 110, 0.35), transparent),
        radial-gradient(ellipse 500px 500px at 80% 50%, rgba(13, 107, 110, 0.15), transparent),
        radial-gradient(ellipse 400px 400px at 50% 90%, rgba(168, 213, 226, 0.08), transparent),
        linear-gradient(160deg, #0D6B6E 0%, #0a4a4d 20%, #0a2a2e 50%, #0a1a1a 100%);
    }

    .card {
      max-width: 440px;
      margin: 0 auto;
      padding: 80px 24px 60px;
      text-align: center;
    }

    .app-icon {
      width: 88px;
      height: 88px;
      border-radius: 20px;
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.08);
      margin: 0 auto 24px;
      display: block;
    }

    h1 {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 8px;
      line-height: 1.15;
    }

    .subtitle {
      font-size: 17px;
      color: var(--on-surface-variant);
      margin-bottom: 32px;
      line-height: 1.5;
    }

    .features {
      text-align: left;
      margin-bottom: 36px;
      padding: 20px 24px;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 16px;
    }

    .features p {
      font-size: 15px;
      color: var(--on-surface-variant);
      line-height: 1.7;
      margin-bottom: 6px;
    }

    .features p:last-child { margin-bottom: 0; }

    .claim-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--accent);
      color: white;
      border: none;
      padding: 16px 36px;
      border-radius: 14px;
      font-size: 17px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      box-shadow: 0 4px 20px rgba(13, 107, 110, 0.4);
      font-family: inherit;
      width: 100%;
    }

    .claim-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 28px rgba(13, 107, 110, 0.55);
    }

    .claim-btn:active { transform: translateY(0); }

    .claim-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .result {
      display: none;
      margin-top: 24px;
      padding: 20px 24px;
      border-radius: 16px;
      text-align: center;
    }

    .result.success {
      display: block;
      background: rgba(13, 107, 110, 0.15);
      border: 1px solid rgba(13, 107, 110, 0.3);
    }

    .result.sold-out {
      display: block;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--surface-border);
    }

    .code-display {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--accent-light);
      margin: 12px 0;
      font-family: 'SF Mono', 'Fira Code', monospace;
      word-break: break-all;
    }

    .result p {
      font-size: 14px;
      color: var(--on-surface-variant);
      line-height: 1.5;
    }

    .redeem-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: white;
      color: #111;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 16px;
      transition: transform 0.15s;
    }

    .redeem-link:hover { transform: translateY(-1px); }

    .result-note {
      font-size: 13px !important;
      color: var(--on-surface-variant);
      margin-top: 14px !important;
      opacity: 0.7;
    }

    .footer {
      text-align: center;
      padding: 40px 24px;
      font-size: 13px;
      color: var(--on-surface-variant);
      opacity: 0.5;
    }

    .footer a {
      color: var(--on-surface-variant);
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="bg-gradient"></div>

  <div class="card">
    <img src="/images/icon.png" alt="Countdown App" class="app-icon">
    <h1>3 Months Free</h1>
    <p class="subtitle">Get Countdown Premium — beautiful timers with photos, widgets, and sharing.</p>

    <div class="features">
      <p>\u2728 Custom photo backgrounds</p>
      <p>\ud83d\udcf1 Home screen &amp; lock screen widgets</p>
      <p>\ud83d\udd14 Notification reminders</p>
      <p>\ud83c\udfa8 23 color themes</p>
      <p>\ud83d\udd17 Share countdown cards</p>
    </div>

    <button class="claim-btn" id="claimBtn" onclick="claimCode()">
      Claim 3 Months Free
    </button>

    <div class="result" id="successResult">
      <p>\ud83c\udf89 Your code:</p>
      <div class="code-display" id="codeDisplay"></div>
      <a class="redeem-link" id="redeemLink" href="#" target="_blank">
        Open in App Store
      </a>
      <p class="result-note" id="alreadyNote" style="display:none;">
        You already claimed a code earlier — here it is again.
      </p>
      <p class="result-note">
        Don't have the app yet? <a href="https://apps.apple.com/app/countdown-app-timer/id6759678361" style="color: var(--accent-light);">Download it first</a>, then redeem.
      </p>
    </div>

    <div class="result" id="soldOutResult">
      <p style="font-size: 18px; margin-bottom: 8px;">All codes have been claimed!</p>
      <p>Comment on our Reddit post to request a code when we restock.</p>
    </div>

    <div class="result" id="errorResult">
      <p id="errorMessage">Something went wrong. Please try again.</p>
    </div>
  </div>

  <div class="footer">
    <a href="/">countdownapp.cc</a> · <a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a>
  </div>

  <script>
    const APP_STORE_ID = "6759678361";

    function getCampaign() {
      const parts = window.location.pathname.replace(/\\/+$/, "").split("/");
      const slug = parts[parts.length - 1];
      return slug && slug !== "redeem" ? slug : "default";
    }

    async function claimCode() {
      const btn = document.getElementById("claimBtn");
      btn.disabled = true;
      btn.textContent = "Claiming\u2026";

      try {
        const res = await fetch("/api/claim-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ campaign: getCampaign() }),
        });

        const data = await res.json();

        if (data.soldOut) {
          btn.style.display = "none";
          document.getElementById("soldOutResult").classList.add("sold-out");
          return;
        }

        if (data.success) {
          btn.style.display = "none";
          document.getElementById("codeDisplay").textContent = data.code;
          document.getElementById("redeemLink").href =
            "https://apps.apple.com/redeem?ctx=offercodes&id=" + APP_STORE_ID + "&code=" + data.code;
          if (data.alreadyClaimed) {
            document.getElementById("alreadyNote").style.display = "block";
          }
          document.getElementById("successResult").classList.add("success");
          return;
        }

        showError(data.error || "Something went wrong.");
      } catch (err) {
        showError("Network error. Please try again.");
      }
    }

    function showError(msg) {
      const btn = document.getElementById("claimBtn");
      btn.disabled = false;
      btn.textContent = "Claim 3 Months Free";
      document.getElementById("errorMessage").textContent = msg;
      const el = document.getElementById("errorResult");
      el.style.display = "block";
      el.style.background = "rgba(255, 80, 80, 0.1)";
      el.style.border = "1px solid rgba(255, 80, 80, 0.25)";
    }
  </script>
</body>
</html>`;

export async function onRequestGet(context) {
  const campaign = context.params.campaign;

  // Let /redeem/admin fall through to the static admin page
  if (campaign === "admin") {
    return context.next();
  }

  return new Response(HTML, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
