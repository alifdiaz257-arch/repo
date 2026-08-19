import { h } from "../dom.js";
import { spinnerIcon } from "./icons.js";

/**
 * Membuat tombol dengan dukungan status loading bawaan.
 * variant: 'default' | 'primary' | 'accent' | 'ghost' | 'danger'
 */
export function Button({ label, icon, variant = "default", onClick, block = false, title }) {
  let loading = false;
  const iconSlot = h("span", { class: "btn-icon" }, icon || []);
  const textNode = document.createTextNode(label || "");

  const classes = () =>
    ["btn", variant !== "default" ? `btn-${variant}` : "", block ? "btn-block" : ""]
      .filter(Boolean)
      .join(" ");

  const btn = h("button", { type: "button", class: classes(), title }, [iconSlot, textNode]);

  btn.addEventListener("click", async (e) => {
    if (loading || btn.disabled) return;
    if (!onClick) return;
    const result = onClick(e);
    if (result && typeof result.then === "function") {
      setLoading(true);
      try {
        await result;
      } finally {
        setLoading(false);
      }
    }
  });

  function setLoading(v) {
    loading = v;
    btn.disabled = v;
    iconSlot.innerHTML = "";
    iconSlot.appendChild(v ? spinnerIcon() : icon || document.createTextNode(""));
  }

  btn.setLoading = setLoading;
  btn.setDisabled = (v) => { btn.disabled = v; };

  return btn;
}
