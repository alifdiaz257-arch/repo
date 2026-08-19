import { h, mount } from "./dom.js";
import { api } from "./api.js";
import { state, setState } from "./state.js";
import { showToast } from "./components/toast.js";
import { markIcon, arrowLeftIcon, chevronRightIcon, lockIcon, globeIcon } from "./components/icons.js";
import { LoginView } from "./views/login.js";
import { ReposView } from "./views/repos.js";
import { RepoBrowserView } from "./views/repoBrowser.js";

const appRoot = document.getElementById("app");

async function bootstrap() {
  const shell = h("div");
  mount(appRoot, shell);

  const topbar = h("div", { class: "topbar" });
  const viewRoot = h("div");
  shell.appendChild(topbar);
  shell.appendChild(viewRoot);

  try {
    const status = await api.authStatus();
    if (status.authenticated) {
      const user = await api.me();
      setState({ user });
    }
  } catch {
    // belum login, lanjut ke halaman login
  }

  renderTopbar(topbar);
  await renderView(viewRoot);

  window.addEventListener("lifx:navigate", async () => {
    renderTopbar(topbar);
    await renderView(viewRoot);
  });
}

function renderTopbar(topbar) {
  topbar.innerHTML = "";
  topbar.appendChild(h("div", { class: "brand" }, [markIcon(26), "Tools Repo by LIFX"]));

  if (state.currentRepo) {
    topbar.appendChild(
      h("button", { class: "btn btn-ghost", onclick: backToRepos }, [arrowLeftIcon(), "Repo"])
    );
    topbar.appendChild(chevronRightIcon());
    topbar.appendChild(h("span", { style: "font-size:14px;" }, state.currentRepo.full_name));
    topbar.appendChild(state.currentRepo.private ? lockIcon() : globeIcon());
  }

  topbar.appendChild(h("div", { class: "spacer" }));

  if (state.user) {
    topbar.appendChild(h("img", { class: "avatar", src: state.user.avatar_url, alt: state.user.login }));
    topbar.appendChild(h("span", { style: "font-size:13px;color:#8b949e;" }, state.user.login));
    topbar.appendChild(
      h("button", { class: "btn btn-ghost", onclick: logout }, "Keluar")
    );
  }
}

async function backToRepos() {
  setState({ currentRepo: null, selectedFile: null, items: [] });
  window.dispatchEvent(new CustomEvent("lifx:navigate"));
}

async function logout() {
  try {
    await api.logout();
  } catch (e) {
    showToast(e.message, "error");
  }
  setState({ user: null, repos: [], currentRepo: null, selectedFile: null, items: [] });
  window.dispatchEvent(new CustomEvent("lifx:navigate"));
}

async function renderView(viewRoot) {
  viewRoot.innerHTML = "";
  if (!state.user) {
    mount(viewRoot, LoginView());
    return;
  }
  if (state.currentRepo) {
    await RepoBrowserView(viewRoot);
    return;
  }
  await ReposView(viewRoot);
}

// Dipakai antar-modul untuk memicu render ulang penuh (topbar + view)
export async function renderApp() {
  const topbar = document.querySelector(".topbar");
  const viewRoot = topbar?.nextSibling;
  if (topbar) renderTopbar(topbar);
  if (viewRoot) await renderView(viewRoot);
}

bootstrap();
