import GLib from "types/@girs/glib-2.0/glib-2.0";

const DESKTOP_SESSION = GLib.getenv("DESKTOP_SESSION")
let Workspaces;
if (DESKTOP_SESSION === "hyprland") {
 const HyprlandWorkspaces = (await import("./Hyprland"))
 Workspaces = HyprlandWorkspaces.default
}
else if (DESKTOP_SESSION === "river") {
    const RiverWorkspaces = (await import("./River"))
    Workspaces = RiverWorkspaces.default
}
else {
    console.error("<----F---->")
}
export default Workspaces
