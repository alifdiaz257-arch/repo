import { h } from "../dom.js";
import { checkIcon, alertIcon } from "./icons.js";

function ensureContainer() {
  let el = document.getElementById("toast-container");
  if (!el) {
    el = h("div", { id: "toast-container", class: "toast-container" });
    document.body.appendChild(el);
  }
  return el;
}

export function showToast(msg, type = "info") {
  const container = ensureContainer();
  const id = "t" + Math.random().toString(36).slice(2);

  const toastEl = h("div", { class: `toast ${type}`, id }, [
    type === "success" ? checkIcon() : type === "error" ? alertIcon() : null,
    h("span", {}, msg),
    h("button", { onclick: () => toastEl.remove() }, "✕"),
  ]);

  container.appendChild(toastEl);
  setTimeout(() => toastEl.remove(), 4500);
}
