# Tools Repo by LIFX

Website untuk mengelola repository GitHub langsung dari browser: login otomatis
via **GitHub OAuth** (tanpa tempel token manual), buat repo baru atau import
repo yang sudah ada, jelajahi & edit file, serta upload file jenis apa saja
(kode, gambar, audio, video, dll). Tampilan bertema GitHub (Primer dark).

## Struktur folder

```
tools-repo-by-lifx/
├── server/                  # Backend Express (proxy GitHub API + OAuth)
│   ├── index.js
│   └── routes/
│       ├── auth.js          # /auth/login, /auth/callback, /auth/logout
│       └── github.js        # proxy aman ke api.github.com
├── public/                  # Frontend statis (vanilla JS, tanpa build step)
│   ├── index.html
│   ├── css/
│   │   ├── tokens.css       # palet warna ala GitHub
│   │   ├── base.css
│   │   ├── components.css
│   │   └── layout.css
│   ├── js/
│   │   ├── main.js          # entry point
│   │   ├── state.js         # store sederhana
│   │   ├── api.js           # pemanggil endpoint backend
│   │   ├── dom.js           # helper bikin elemen
│   │   ├── utils/
│   │   │   ├── fileType.js
│   │   │   └── base64.js
│   │   ├── components/
│   │   │   ├── button.js
│   │   │   ├── modal.js
│   │   │   ├── toast.js
│   │   │   └── icons.js
│   │   └── views/
│   │       ├── login.js
│   │       ├── repos.js
│   │       └── repoBrowser.js
│   └── assets/
│       └── logo.svg
├── package.json
├── .env.example
└── .gitignore
```

## Kenapa perlu backend?

Login GitHub yang sebenarnya (OAuth) mengharuskan `client_secret` ditukar
dengan `access_token` di sisi server — nilai itu **tidak boleh** pernah
sampai ke browser. Karena itu proyek ini punya server Express kecil yang:

1. Mengarahkan kamu ke halaman login GitHub (`/auth/login`).
2. Menerima kode dari GitHub di `/auth/callback`, menukarnya dengan token.
3. Menyimpan token itu di **session server** (bukan di browser).
4. Meneruskan (proxy) semua request ke GitHub API lewat `/api/...` sambil
   menyisipkan token — jadi frontend tidak pernah memegang token sama sekali.

Hasilnya: kamu tinggal klik "Masuk dengan GitHub", login seperti biasa,
lalu otomatis kembali ke aplikasi dalam keadaan sudah login.

## Cara menjalankan

1. **Buat GitHub OAuth App**
   Buka https://github.com/settings/developers → "New OAuth App", isi:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/auth/callback`

   Catat **Client ID** dan **Client Secret** yang muncul.

2. **Salin konfigurasi**
   ```bash
   cp .env.example .env
   ```
   Lalu isi `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, dan `SESSION_SECRET`
   di file `.env`.

3. **Install dependency & jalankan**
   ```bash
   npm install
   npm start
   ```

4. Buka `http://localhost:3000`, klik **Masuk dengan GitHub**, login, dan
   kamu akan otomatis masuk ke dashboard repo.

## Fitur

- Login GitHub OAuth otomatis (tanpa input token manual)
- Buat repository baru (nama, deskripsi, publik/private)
- Import repository yang sudah ada (`owner/nama-repo`)
- Jelajahi struktur folder & file repo
- Buat, buka, edit, dan commit file teks/kode langsung dari browser
- Upload file jenis apa pun: kode, gambar, audio, video, dokumen, dll
- Pratinjau otomatis untuk gambar, audio, dan video
- Hapus file, unduh file
- Tombol dengan status loading, notifikasi toast, tema gelap ala GitHub

## Catatan keamanan

Jangan commit file `.env` (sudah masuk `.gitignore`). Untuk deploy ke
produksi, gunakan HTTPS dan atur `cookie.secure = true` pada konfigurasi
session di `server/index.js`.
