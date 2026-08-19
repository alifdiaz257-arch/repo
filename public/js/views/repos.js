import { h, mount } from "../dom.js";
import { api } from "../api.js";
import { state, setState } from "../state.js";
import { showToast } from "../components/toast.js";
import { openModal, closeModal } from "../components/modal.js";
import { Button } from "../components/button.js";
import {
  searchIcon, plusIcon, chevronRightIcon, starIcon, lockIcon, globeIcon,
} from "../components/icons.js";
import { openRepo } from "./repoBrowser.js";

export async function ReposView(root) {
  let filter = "";
  const wrap = h("div", { class: "repos-wrap" });
  mount(root, wrap);

  const listBox = h("div");

  function renderList() {
    listBox.innerHTML = "";
    const filtered = state.repos.filter((r) => r.name.toLowerCase().includes(filter.toLowerCase()));

    if (state.repos.length === 0) {
      listBox.appendChild(
        h("div", { class: "empty-state" }, "Belum ada repository. Buat baru atau import repo yang sudah ada.")
      );
      return;
    }
    const box = h("div", { class: "repo-list" },
      filtered.map((r) =>
        h("div", { class: "row", onclick: () => openRepo(r) }, [
          h("div", { style: "flex:1;min-width:0;" }, [
            h("div", { style: "display:flex;align-items:center;gap:8px;" }, [
              h("span", { style: "color:#58a6ff;font-weight:600;font-size:14px;" }, r.name),
              h("span", { class: "badge" }, r.private ? "Private" : "Public"),
            ]),
            r.description
              ? h("div", { style: "font-size:12px;color:#8b949e;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" }, r.description)
              : null,
          ]),
          h("span", { style: "font-size:12px;color:#6e7681;display:flex;align-items:center;gap:4px;" }, [
            starIcon(), String(r.stargazers_count ?? 0),
          ]),
          chevronRightIcon(),
        ])
      )
    );
    listBox.appendChild(box);
  }

  const searchInput = h("input", {
    type: "text",
    placeholder: "Cari repository...",
    oninput: (e) => { filter = e.target.value; renderList(); },
  });

  const toolbar = h("div", { class: "repos-toolbar" }, [
    h("div", { class: "search" }, [searchIcon(), searchInput]),
    Button({ label: "Refresh", variant: "ghost", onClick: refresh }),
    Button({ label: "Import repo", variant: "default", onClick: showImportModal }),
    Button({ label: "Repo baru", variant: "primary", icon: plusIcon(), onClick: showNewRepoModal }),
  ]);

  wrap.appendChild(toolbar);
  wrap.appendChild(listBox);

  async function refresh() {
    const repos = await api.repos();
    setState({ repos });
    renderList();
  }

  renderList();
  if (state.repos.length === 0) refresh().catch((e) => showToast(e.message, "error"));

  function showNewRepoModal() {
    const nameInput = h("input", { type: "text", placeholder: "nama-repo-saya" });
    const descInput = h("input", { type: "text", placeholder: "(opsional)" });
    const privateCheck = h("input", { type: "checkbox" });

    const submitBtn = Button({
      label: "Buat repository",
      variant: "primary",
      block: true,
      onClick: async () => {
        if (!nameInput.value.trim()) return;
        try {
          const repo = await api.createRepo({
            name: nameInput.value.trim(),
            description: descInput.value.trim(),
            private: privateCheck.checked,
            auto_init: true,
          });
          showToast(`Repo "${repo.full_name}" dibuat`, "success");
          closeModal();
          await refresh();
          openRepo(repo);
        } catch (e) {
          showToast(e.message, "error");
        }
      },
    });

    openModal({
      title: "Buat repository baru",
      body: [
        h("div", { class: "field" }, [h("label", {}, "Nama repository"), nameInput]),
        h("div", { class: "field" }, [h("label", {}, "Deskripsi"), descInput]),
        h("label", { style: "display:flex;align-items:center;gap:8px;font-size:13px;margin-bottom:16px;cursor:pointer;" }, [
          privateCheck, "Jadikan private",
        ]),
        submitBtn,
      ],
    });
  }

  function showImportModal() {
    const input = h("input", { type: "text", placeholder: "octocat/hello-world" });
    const submitBtn = Button({
      label: "Buka repository",
      variant: "primary",
      block: true,
      onClick: async () => {
        const val = input.value.trim().replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "");
        if (!val.includes("/")) { showToast("Format harus owner/nama-repo", "error"); return; }
        const [owner, name] = val.split("/");
        try {
          const repo = await api.getRepo(owner, name);
          showToast(`Repo "${repo.full_name}" ditambahkan`, "success");
          closeModal();
          if (!state.repos.some((r) => r.id === repo.id)) {
            setState({ repos: [repo, ...state.repos] });
          }
          openRepo(repo);
        } catch (e) {
          showToast(e.message, "error");
        }
      },
    });

    openModal({
      title: "Import repository yang sudah ada",
      body: [
        h("div", { class: "field" }, [h("label", {}, "owner/nama-repo atau URL GitHub"), input]),
        h("p", { class: "hint", style: "margin-bottom:14px;" }, "Repo harus dapat diakses oleh akun GitHub kamu."),
        submitBtn,
      ],
    });
  }
}
