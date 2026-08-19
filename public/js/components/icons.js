// Ikon garis sederhana buatan sendiri (bukan aset Octicons GitHub),
// supaya bebas dipakai tanpa masalah hak cipta.

function svg(pathsHtml, size = 16) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  el.setAttribute("width", size);
  el.setAttribute("height", size);
  el.setAttribute("viewBox", "0 0 24 24");
  el.setAttribute("fill", "none");
  el.innerHTML = pathsHtml;
  return el;
}

export const spinnerIcon = (size = 14) =>
  svg(
    `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-opacity="0.25"/>
     <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,
    size
  );
spinnerIcon.toString = () => "spinner";

export function spinnerEl(size = 14) {
  const el = spinnerIcon(size);
  el.classList.add("spinner");
  return el;
}

export const folderIcon = (size = 16) =>
  svg(`<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
        stroke="#58a6ff" stroke-width="1.6" fill="#58a6ff" fill-opacity="0.15"/>`, size);

export const fileIcon = (size = 16) =>
  svg(`<path d="M6 3.5h8l4 4v13a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-16A.5.5 0 0 1 6 3.5Z" stroke="#8b949e" stroke-width="1.5"/>
       <path d="M14 3.5V8h4.5" stroke="#8b949e" stroke-width="1.5"/>`, size);

export const codeIcon = (size = 16) =>
  svg(`<path d="M9 8 5 12l4 4M15 8l4 4-4 4" stroke="#8b949e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`, size);

export const imageIcon = (size = 16) =>
  svg(`<rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="#a5a5ff" stroke-width="1.5"/>
       <circle cx="8.5" cy="9.5" r="1.5" fill="#a5a5ff"/>
       <path d="M4 16.5 9 12l3 3 4-4.5L20 16" stroke="#a5a5ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`, size);

export const audioIcon = (size = 16) =>
  svg(`<path d="M9 17V6.5l9-2v10.5" stroke="#ff9bce" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
       <circle cx="6.5" cy="17.5" r="2.5" stroke="#ff9bce" stroke-width="1.5"/>
       <circle cx="15.5" cy="15" r="2.5" stroke="#ff9bce" stroke-width="1.5"/>`, size);

export const videoIcon = (size = 16) =>
  svg(`<rect x="3" y="5.5" width="13" height="13" rx="2" stroke="#ffa657" stroke-width="1.5"/>
       <path d="m16.5 10.5 4.5-2.5v8l-4.5-2.5" stroke="#ffa657" stroke-width="1.5" stroke-linejoin="round"/>`, size);

export const uploadIcon = (size = 15) =>
  svg(`<path d="M12 16V4M8 8l4-4 4 4M4 17v2.5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V17" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`, size);

export const plusIcon = (size = 14) =>
  svg(`<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`, size);

export const trashIcon = (size = 14) =>
  svg(`<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`, size);

export const downloadIcon = (size = 14) =>
  svg(`<path d="M12 4v11M8 11l4 4 4-4M4 19h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`, size);

export const chevronRightIcon = (size = 13) =>
  svg(`<path d="m9 6 6 6-6 6" stroke="#6e7681" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`, size);

export const searchIcon = (size = 14) =>
  svg(`<circle cx="11" cy="11" r="6.5" stroke="#6e7681" stroke-width="1.7"/><path d="m20 20-4.3-4.3" stroke="#6e7681" stroke-width="1.7" stroke-linecap="round"/>`, size);

export const lockIcon = (size = 13) =>
  svg(`<rect x="5" y="10.5" width="14" height="9" rx="2" stroke="#d29922" stroke-width="1.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="#d29922" stroke-width="1.5"/>`, size);

export const globeIcon = (size = 13) =>
  svg(`<circle cx="12" cy="12" r="8.5" stroke="#8b949e" stroke-width="1.5"/><path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.2-3.8-8.5S9.5 5.8 12 3.5Z" stroke="#8b949e" stroke-width="1.5"/>`, size);

export const arrowLeftIcon = (size = 14) =>
  svg(`<path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`, size);

export const branchIcon = (size = 14) =>
  svg(`<circle cx="6" cy="6" r="2" stroke="currentColor" stroke-width="1.6"/><circle cx="6" cy="18" r="2" stroke="currentColor" stroke-width="1.6"/><circle cx="18" cy="9" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M6 8v8M6 12c0-3 4-3 4-6" stroke="currentColor" stroke-width="1.6"/>`, size);

export const starIcon = (size = 12) =>
  svg(`<path d="m12 4 2.3 5 5.5.5-4.2 3.7 1.3 5.4L12 15.9 7.1 18.6l1.3-5.4L4.2 9.5l5.5-.5L12 4Z" stroke="#6e7681" stroke-width="1.3" stroke-linejoin="round"/>`, size);

export const checkIcon = (size = 15) =>
  svg(`<path d="m4 12 5 5 11-11" stroke="#3fb950" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`, size);

export const alertIcon = (size = 15) =>
  svg(`<circle cx="12" cy="12" r="9" stroke="#f85149" stroke-width="1.7"/><path d="M12 7.5v6M12 16.5v.1" stroke="#f85149" stroke-width="1.7" stroke-linecap="round"/>`, size);

export const markIcon = (size = 26) =>
  svg(`<rect x="1" y="1" width="22" height="22" rx="6" stroke="#c9d1d9" stroke-width="1.5"/>
       <path d="M7 17V7h2.6c1.9 0 3 1 3 2.6 0 1.1-.6 1.9-1.6 2.2l1.9 4.1h-2l-1.6-3.6H8.6V17H7Z" fill="#58a6ff"/>`, size);

export function fileKindIcon(kind, isDir, size = 16) {
  if (isDir) return folderIcon(size);
  if (kind === "image") return imageIcon(size);
  if (kind === "audio") return audioIcon(size);
  if (kind === "video") return videoIcon(size);
  return fileIcon(size);
}
