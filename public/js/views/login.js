import { h } from "../dom.js";
import { markIcon } from "../components/icons.js";

export function LoginView() {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");

  return h("div", { class: "login-wrap" }, [
    h("div", { class: "login-card" }, [
      h("div", { class: "hero" }, [
        markIcon(48),
        h("h1", {}, "Tools Repo by LIFX"),
        h("p", {}, "Kelola file repository GitHub—kode, gambar, audio, video, dan apa pun—langsung dari browser."),
      ]),
      h("div", { class: "panel" }, [
        error
          ? h("div", { style: "color:#f85149;font-size:13px;margin-bottom:12px;" }, "Login gagal, silakan coba lagi.")
          : null,
        h(
          "a",
          { href: "/auth/login", class: "btn btn-primary btn-block", style: "text-decoration:none;" },
          "Masuk dengan GitHub"
        ),
        h(
          "p",
          { class: "hint" },
          "Kamu akan diarahkan ke halaman login resmi GitHub. Setelah menyetujui akses, token diambil dan disimpan otomatis di server—tidak ada token yang perlu ditempel manual."
        ),
      ]),
    ]),
  ]);
}
