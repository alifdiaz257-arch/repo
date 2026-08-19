const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CALLBACK_URL =
  process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/auth/callback";

// Mulai proses login: redirect ke halaman otorisasi GitHub
router.get("/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  req.session.oauthState = state;

  const params = new URLSearchParams({
    client_id: CLIENT_ID || "",
    redirect_uri: CALLBACK_URL,
    scope: "repo read:user",
    state,
    allow_signup: "true",
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

// GitHub redirect balik ke sini dengan ?code=...&state=...
router.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state || state !== req.session.oauthState) {
    return res.redirect("/?error=state_tidak_valid");
  }
  delete req.session.oauthState;

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: CALLBACK_URL,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("Token exchange gagal:", tokenData);
      return res.redirect("/?error=tukar_token_gagal");
    }

    // Token HANYA disimpan di session server, tidak pernah dikirim ke browser
    req.session.githubToken = tokenData.access_token;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/?error=server_error");
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("lifx.sid");
    res.json({ ok: true });
  });
});

// Dipakai frontend untuk cek status login saat halaman dimuat
router.get("/status", (req, res) => {
  res.json({ authenticated: Boolean(req.session.githubToken) });
});

module.exports = router;
