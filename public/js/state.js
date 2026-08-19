const listeners = new Set();

export const state = {
  user: null,
  repos: [],
  currentRepo: null, // { owner, name, full_name, default_branch, private, description }
  currentPath: "",
  items: [],
  selectedFile: null,
};

export function setState(patch) {
  Object.assign(state, patch);
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
