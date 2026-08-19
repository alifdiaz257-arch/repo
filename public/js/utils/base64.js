export function utf8ToB64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export function b64ToUtf8(b64) {
  const clean = b64.replace(/\n/g, "");
  try {
    return decodeURIComponent(escape(atob(clean)));
  } catch {
    return atob(clean);
  }
}

// Membaca File apa pun (kode, gambar, audio, video, dll) menjadi base64,
// dipakai untuk upload via GitHub Contents API.
export function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result; // data:<mime>;base64,XXXX
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}
