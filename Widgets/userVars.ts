import GLib from "types/@girs/glib-2.0/glib-2.0";

export const Globals = {
  CurrentUser: GLib.getenv("USER"),
  HOME: GLib.getenv("HOME"),
};
