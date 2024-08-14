import { Globals } from "Modules/userVars";

let Workspaces;
if (Globals.DESKTOP_SESSION === "hyprland") {
  const HyprlandWorkspaces = await import("./Hyprland");
  Workspaces = HyprlandWorkspaces.default;
} else if (Globals.DESKTOP_SESSION === "river") {
//  const RiverWorkspaces = await import("./River");
//  Workspaces = RiverWorkspaces.default;
} else {
  console.error("<----F---->");
}
export default Workspaces;
