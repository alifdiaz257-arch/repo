import { h, mount } from "../dom.js";
import { api } from "../api.js";
import { state, setState } from "../state.js";
import { showToast } from "../components/toast.js";
import { openModal, closeModal } from "../components/modal.js";
import { Button } from "../components/button.js";
import { kindOf, mimeOf } from "../utils/fileType.js";
import { utf8ToB64, b64ToUtf8, readFileAsBase64 } from "../utils/base64.js";
import {
  fileKindIcon, uploadIcon, plusIcon, trashIcon, downloadIcon,
  chevronRightIcon, branchIcon, spinnerEl,
} from "../components/icons.js";

export function openRepo(repo) {
  setState({
    currentRepo: {
      owner: repo.owner.login,
      name: repo.name,
      full_name: repo.full_name,
      default_branch: repo.default_branch || "main",
      private: repo.private,
      description: repo.description,
    },
    currentPath: "",
    selectedFile: null,
    items: [],
  });
  window.dispatchEvent(new CustomEvent("lifx:navigate"));
}

export async function RepoBrowserView(root) {
  const repo = state.currentRepo;
  const wrap = h("div", { class: "browser" });
  mount(root, wrap);

  const crumbsBox = h("div", { class: "crumbs" });
  const treeBox = h("div", { class: "tree" });
  const contentBox = h("div", { class: "content" });

  const fileInput = h("input", { type: "file", multiple: true, hidden: true, onchange: onUpload });

  const sidebar = h("div", { class: "sidebar" }, [
    crumbsBox,
    h("div", { class: "actions" }, [
      Button({ label: "Upload", icon: uploadIcon(), onClick: () => fileInput.click() }),
      Button({ label: "File baru", icon: plusIcon(), variant: "ghost", onClick: showNewFileModal }),
      fileInput,
    ]),
    treeBox,
  ]);

  wrap.appendChild(sidebar);
  wrap.appendChild(contentBox);

  renderCrumbs();
  renderEmptyContent();
  await loadDir(state.currentPath);

  function renderCrumbs() {
    crumbsBox.innerHTML = "";
    crumbsBox.appendChild(h("span", { class: "crumb", onclick: () => goTo("") }, repo.name));
    const parts = state.currentPath ? state.currentPath.split("/") : [];
    parts.forEach((p, i) => {
      crumbsBox.appendChild(chevronRightIcon());
      crumbsBox.appendChild(
        h("span", { class: "crumb", style: i === parts.length - 1 ? "color:#c9d1d9" : "", onclick: () => goTo(parts.slice(0, i + 1).join("/")) }, p)
      );
    });
  }

  async function goTo(path) {
    setState({ currentPath: path, selectedFile: null });
    renderCrumbs();
    renderEmptyContent();
    await loadDir(path);
  }

  async function loadDir(path) {
    treeBox.innerHTML = "";
    treeBox.appendChild(h("div", { style: "padding:30px;text-align:center;color:#8b949e;" }, [spinnerEl(20)]));
    try {
      const data = await api.getContents(repo.owner, repo.name, path, repo.default_branch);
      const arr = Array.isArray(data) ? data : [data];
      arr.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "dir" ? -1 : 1));
      setState({ items: arr });
      renderTree(arr);
    } catch (e) {
      showToast(e.message, "error");
      setState({ items: [] });
      treeBox.innerHTML = "";
    }
  }

  function renderTree(items) {
    treeBox.innerHTML = "";
    if (items.length === 0) {
      treeBox.appendChild(h("div", { style: "padding:24px;text-align:center;color:#6e7681;font-size:13px;" }, "Folder kosong"));
      return;
    }
    items.forEach((it) => {
      const isDir = it.type === "dir";
      const nameEl = h("span", { class: "name", style: state.selectedFile?.path === it.path ? "color:#58a6ff" : "" }, it.name);
      const iconSlot = h("span", { style: "display:flex;" }, fileKindIcon(kindOf(it.name), isDir));

      const row = h("div", { class: "tree-row" }, [
        h("div", { style: "display:flex;align-items:center;gap:8px;flex:1;min-width:0;", onclick: () => (isDir ? goTo(it.path) : openFile(it, iconSlot)) }, [
          iconSlot, nameEl,
        ]),
        h("button", { class: "del", title: "Hapus", onclick: (e) => { e.stopPropagation(); deleteItem(it); } }, trashIcon()),
      ]);
      treeBox.appendChild(row);
    });
  }

  function renderEmptyContent() {
    contentBox.innerHTML = "";
    contentBox.appendChild(
      h("div", { class: "empty" }, [
        fileKindIcon("text", false, 40),
        h("p", { style: "margin-top:10px;font-size:14px;" }, "Pilih file untuk melihat atau mengedit"),
        h("p", { style: "font-size:12px;margin-top:4px;" }, "Semua jenis file didukung: kode, gambar, audio, video, dll."),
      ])
    );
  }

  async function openFile(item, iconSlot) {
    const original = iconSlot.innerHTML;
    iconSlot.innerHTML = "";
    iconSlot.appendChild(spinnerEl(14));
    try {
      const data = await api.getContents(repo.owner, repo.name, item.path, repo.default_branch);
      const kind = kindOf(item.name);
      const cleanB64 = (data.content || "").replace(/\n/g, "");
      const file = { path: item.path, name: item.name, sha: data.sha, kind, content: cleanB64 };
      if (kind === "text") {
        file.text = data.size > 900000 ? "(File terlalu besar untuk ditampilkan/diedit di sini)" : b64ToUtf8(cleanB64);
      }
      setState({ selectedFile: file });
      renderFile(file);
      renderTree(state.items);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      iconSlot.innerHTML = "";
      iconSlot.appendChild(fileKindIcon(kindOf(item.name), false));
    }
  }

  function renderFile(file) {
    contentBox.innerHTML = "";
    let dirty = false;
    let editText = file.text || "";

    const dirtyLabel = h("span", { style: "font-size:11px;color:#d29922;", hidden: true }, "• belum disimpan");
    const commitBtn = Button({ label: "Commit", variant: "primary", icon: branchIcon(13), onClick: () => showCommitModal() });
    commitBtn.disabled = true;

    const toolbar = h("div", { class: "file-toolbar" }, [
      fileKindIcon(file.kind, false),
      h("span", {}, file.path),
      dirtyLabel,
      h("div", { style: "flex:1;" }),
      file.kind === "text" ? commitBtn : null,
      h("a", { href: `data:${mimeOf(file.name)};base64,${file.content}`, download: file.name, style: "text-decoration:none;" }, [
        Button({ label: "Unduh", variant: "ghost", icon: downloadIcon() }),
      ]),
    ]);

    const pane = h("div", { class: "pane" });

    if (file.kind === "text") {
      const textarea = h("textarea", {
        value: editText,
        spellcheck: false,
        oninput: (e) => {
          editText = e.target.value;
          dirty = true;
          dirtyLabel.hidden = false;
          commitBtn.disabled = false;
        },
      });
      pane.appendChild(textarea);
    } else if (file.kind === "image") {
      pane.appendChild(h("div", { class: "media-preview" }, [h("img", { src: `data:${mimeOf(file.name)};base64,${file.content}`, alt: file.name })]));
    } else if (file.kind === "audio") {
      pane.appendChild(h("div", { class: "media-preview" }, [h("audio", { controls: true, src: `data:${mimeOf(file.name)};base64,${file.content}` })]));
    } else if (file.kind === "video") {
      pane.appendChild(h("div", { class: "media-preview" }, [h("video", { controls: true, src: `data:${mimeOf(file.name)};base64,${file.content}` })]));
    }

    contentBox.appendChild(toolbar);
    contentBox.appendChild(pane);

    function showCommitModal() {
      const msgInput = h("input", { type: "text", value: `Update ${file.name}` });
      const submitBtn = Button({
        label: "Commit ke branch utama",
        variant: "primary",
        icon: branchIcon(13),
        block: true,
        onClick: async () => {
          try {
            const res = await api.putContents(repo.owner, repo.name, file.path, {
              message: msgInput.value.trim() || `Update ${file.name}`,
              content: utf8ToB64(editText),
              sha: file.sha,
              branch: repo.default_branch,
            });
            showToast(`Tersimpan: ${file.path}`, "success");
            file.sha = res.content.sha;
            file.text = editText;
            file.content = utf8ToB64(editText);
            dirty = false;
            dirtyLabel.hidden = true;
            commitBtn.disabled = true;
            closeModal();
          } catch (e) {
            showToast(e.message, "error");
          }
        },
      });
      openModal({
        title: "Commit perubahan",
        body: [h("div", { class: "field" }, [h("label", {}, "Pesan commit"), msgInput]), submitBtn],
      });
    }
  }

  async function deleteItem(item) {
    if (!window.confirm(`Hapus "${item.path}"?`)) return;
    try {
      const data = await api.getContents(repo.owner, repo.name, item.path, repo.default_branch);
      await api.deleteContents(repo.owner, repo.name, item.path, {
        message: `Delete ${item.path}`,
        sha: data.sha,
        branch: repo.default_branch,
      });
      showToast(`Dihapus: ${item.path}`, "success");
      if (state.selectedFile?.path === item.path) {
        setState({ selectedFile: null });
        renderEmptyContent();
      }
      await loadDir(state.currentPath);
    } catch (e) {
      showToast(e.message, "error");
    }
  }

  async function onUpload(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    for (const f of files) {
      try {
        const b64 = await readFileAsBase64(f);
        const path = state.currentPath ? `${state.currentPath}/${f.name}` : f.name;
        let sha;
        try {
          const existing = await api.getContents(repo.owner, repo.name, path, repo.default_branch);
          sha = existing.sha;
        } catch { /* belum ada, akan dibuat baru */ }
        await api.putContents(repo.owner, repo.name, path, {
          message: `${sha ? "Update" : "Add"} ${f.name}`,
          content: b64,
          branch: repo.default_branch,
          ...(sha ? { sha } : {}),
        });
        showToast(`Diunggah: ${f.name}`, "success");
      } catch (err) {
        showToast(`Gagal unggah ${f.name}: ${err.message}`, "error");
      }
    }
    await loadDir(state.currentPath);
  }

  function showNewFileModal() {
    const nameInput = h("input", { type: "text", placeholder: "index.js" });
    const submitBtn = Button({
      label: "Buat file",
      variant: "primary",
      block: true,
      onClick: async () => {
        if (!nameInput.value.trim()) return;
        try {
          const path = state.currentPath ? `${state.currentPath}/${nameInput.value.trim()}` : nameInput.value.trim();
          await api.putContents(repo.owner, repo.name, path, {
            message: `Create ${nameInput.value.trim()}`,
            content: utf8ToB64(""),
            branch: repo.default_branch,
          });
          showToast(`File dibuat: ${path}`, "success");
          closeModal();
          await loadDir(state.currentPath);
        } catch (e) {
          showToast(e.message, "error");
        }
      },
    });
    openModal({
      title: `Buat file baru di ${state.currentPath || "/"}`,
      body: [h("div", { class: "field" }, [h("label", {}, "Nama file"), nameInput]), submitBtn],
    });
  }
}
