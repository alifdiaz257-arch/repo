export const IMG_EXT = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico", "avif"];
export const AUD_EXT = ["mp3", "wav", "ogg", "flac", "m4a", "aac", "weba"];
export const VID_EXT = ["mp4", "webm", "mov", "mkv", "avi", "m4v"];

export const MIME = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif",
  webp: "image/webp", svg: "image/svg+xml", bmp: "image/bmp", ico: "image/x-icon", avif: "image/avif",
  mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg", flac: "audio/flac",
  m4a: "audio/mp4", aac: "audio/aac", weba: "audio/webm",
  mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime",
  mkv: "video/x-matroska", avi: "video/x-msvideo", m4v: "video/x-m4v",
};

export function ext(name) {
  return name.includes(".") ? name.split(".").pop().toLowerCase() : "";
}

export function kindOf(name) {
  const e = ext(name);
  if (IMG_EXT.includes(e)) return "image";
  if (AUD_EXT.includes(e)) return "audio";
  if (VID_EXT.includes(e)) return "video";
  return "text";
}

export function mimeOf(name) {
  return MIME[ext(name)] || "application/octet-stream";
}
