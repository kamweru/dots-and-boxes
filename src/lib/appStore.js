import { writable } from "svelte/store";
const app = writable({});
export const store = {
  subscribe: app.subscribe,
  set: (value) => app.set(value),
  update: (fn) => app.update(fn),
};
