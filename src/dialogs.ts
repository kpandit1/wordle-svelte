import { writable } from "svelte/store";

export enum DialogId {
  Help = "help-dialog",
  Stats = "stats-dialog",
  Settings = "settings-dialog",
}

const dialogStore = writable<DialogId | null>(null);
export default dialogStore;
