import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import AstalHyprland from "astalhyprland-0.1";

const hyprland = AstalHyprland.Hyprland.get_default();

const NWicons = [" ", " ", "󰨞 ", " ", " ", "󰭹 ", " ", " ", "󰊖 ", " "];

export function workspaceRenderer() {
  for (let i = 1; i < 10; i++) {
    const WorkspaceButton = Widget.Button({
      label: NWicons[i - 1],
      on_primary_click_release: () =>
        hyprland?.dispatch("workspace", i.toString()),
    });
    Workspaces.add(WorkspaceButton);
  }
  hyprland?.connect("event", UpdateWorkspaces);
  return Workspaces;
}

const Workspaces = Widget.Box({
  className: "workspaces",
});
export default () =>
  Widget.Box({
    className: "workspaces",
    setup: (self) => {
      const Wicons = [
        "",
        " ",
        " ",
        "󰨞 ",
        " ",
        " ",
        "󰭹 ",
        " ",
        " ",
        "󰊖 ",
        " ",
      ];
      const workspacesCount = 10;
      let workspaceStates = Array.from({ length: workspacesCount }, (_, i) => ({
        id: i + 1,
        focused: false,
        hasWindows: false,
      }));

      const updateWorkspaceStates = () => {
        workspaceStates = workspaceStates.map((ws) => ({
          ...ws,
          focused: Hyprland.active.workspace.id === ws.id,
          hasWindows: Hyprland.workspaces.some(
            (workspace) => workspace.id === ws.id && workspace.windows > 0
          ),
        }));
      };

      const createWorkspaceButton = (ws: {
        focused: any;
        hasWindows: any;
        id: string | number;
      }) => {
        const className = ws.focused ? "focused" : ws.hasWindows ? "work" : "";
        return Widget.Button({
          onClicked: () =>
            execAsync(`/usr/bin/hyprctl dispatch workspace ${ws.id}`),
          child: Widget.Label(`${Wicons[ws.id]}`),
          className,
        });
      };

      const updateWorkspaces = () => {
        updateWorkspaceStates();
        self.children = workspaceStates.map(createWorkspaceButton);
      };

      self.hook(Hyprland.active.workspace, updateWorkspaces, "changed");
      updateWorkspaces();
    },
  });
function UpdateWorkspaces() {
  const fc = hyprland?.focused_workspace.id;
  let i = 0;
  Workspaces.foreach((b) => {
    // if (b != null) {
    //     if (i + 1 == fc) {
    //         b. (new string[] { "focused" });
    //     } else if (workspace_has_windows (i + 1)) {
    //         b.set_css_classes (new string[] { "has-windows" });
    //     } else {
    //         b.set_css_classes (new string[] { "empty" });
    //     }
    // }
    // i++;
  });
}
