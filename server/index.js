require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/auth");
const githubRoutes = require("./routes/github");

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  console.warn(
    "[Tools Repo by LIFX] GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET belum diisi. " +
      "Salin .env.example menjadi .env dan isi kredensial OAuth App kamu."
  );
}

app.use(express.json({ limit: "15mb" }));

app.use(
  session({
    name: "lifx.sid",
    secret: process.env.SESSION_SECRET || "ganti-secret-ini-secepatnya",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 8, // 8 jam
    },
  })
);

app.use("/auth", authRoutes);
app.use("/api", githubRoutes);

app.use(express.static(path.join(__dirname, "..", "public")));

// SPA fallback: semua route lain kembali ke index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Tools Repo by LIFX jalan di http://localhost:${PORT}`);
});
