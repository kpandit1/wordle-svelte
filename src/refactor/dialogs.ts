/**
 * Handles which option dialog is currently open. Only one can be open at a time
 */

import { writable } from "svelte/store";

export enum DialogId {
  Help = "help-dialog",
  Stats = "stats-dialog",
  Settings = "settings-dialog",
}

const dialogStore = writable<DialogId | null>();
export default dialogStore;
