const express = require("express");
const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.githubToken) {
    return res.status(401).json({ message: "Belum login. Silakan masuk dengan GitHub." });
  }
  next();
}

async function gh(req, ghPath, opts = {}) {
  const r = await fetch(`https://api.github.com${ghPath}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${req.session.githubToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opts.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  return r;
}

async function relay(r, res) {
  const text = await r.text();
  res.status(r.status);
  res.set("Content-Type", r.headers.get("content-type") || "application/json");
  res.send(text);
}

// Profil user yang sedang login
router.get("/me", requireAuth, async (req, res) => {
  const r = await gh(req, "/user");
  relay(r, res);
});

// Daftar repo milik user
router.get("/repos", requireAuth, async (req, res) => {
  const r = await gh(req, "/user/repos?per_page=100&sort=updated");
  relay(r, res);
});

// Buat repo baru
router.post("/repos", requireAuth, async (req, res) => {
  const r = await gh(req, "/user/repos", {
    method: "POST",
    body: JSON.stringify(req.body),
  });
  relay(r, res);
});

// Ambil detail satu repo (dipakai saat "Import repo")
router.get("/repos/:owner/:repo", requireAuth, async (req, res) => {
  const r = await gh(req, `/repos/${req.params.owner}/${req.params.repo}`);
  relay(r, res);
});

// Baca isi folder/file
router.get("/repos/:owner/:repo/contents/*", requireAuth, async (req, res) => {
  const filePath = req.params[0] || "";
  const ref = req.query.ref ? `?ref=${encodeURIComponent(req.query.ref)}` : "";
  const r = await gh(
    req,
    `/repos/${req.params.owner}/${req.params.repo}/contents/${filePath}${ref}`
  );
  relay(r, res);
});

// Buat / update file (juga dipakai untuk upload semua jenis file, base64)
router.put("/repos/:owner/:repo/contents/*", requireAuth, async (req, res) => {
  const filePath = req.params[0] || "";
  const r = await gh(
    req,
    `/repos/${req.params.owner}/${req.params.repo}/contents/${filePath}`,
    { method: "PUT", body: JSON.stringify(req.body) }
  );
  relay(r, res);
});

// Hapus file
router.delete("/repos/:owner/:repo/contents/*", requireAuth, async (req, res) => {
  const filePath = req.params[0] || "";
  const r = await gh(
    req,
    `/repos/${req.params.owner}/${req.params.repo}/contents/${filePath}`,
    { method: "DELETE", body: JSON.stringify(req.body) }
  );
  relay(r, res);
});

module.exports = router;
