import { h, mount, clear } from "../dom.js";

let overlayEl = null;

function ensureRoot() {
  let root = document.getElementById("modal-root");
  if (!root) {
    root = h("div", { id: "modal-root" });
    document.body.appendChild(root);
  }
  return root;
}

export function closeModal() {
  const root = document.getElementById("modal-root");
  if (root) clear(root);
  overlayEl = null;
}

export function openModal({ title, body }) {
  const root = ensureRoot();

  const backdrop = h(
    "div",
    {
      class: "modal-backdrop",
      onmousedown: (e) => { if (e.target === backdrop) closeModal(); },
    },
    [
      h("div", { class: "modal" }, [
        h("div", { class: "modal-header" }, [
          h("span", {}, title),
          h("button", { class: "modal-close", onclick: closeModal }, "✕"),
        ]),
        h("div", { class: "modal-body" }, body),
      ]),
    ]
  );

  overlayEl = backdrop;
  mount(root, backdrop);
}
