import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";

export default () => Widget.Box({
  className: "workspaces",
  setup: (self) => {
    const Wicons = ["", " ", " ", "󰨞 ", " ", " ", "󰭹 ", " ", " ", "󰊖 ", " "];
    const workspacesCount = 10;
    let workspaceStates = Array.from({ length: workspacesCount }, (_, i) => ({
      id: i + 1,
      focused: false,
      hasWindows: false,
    }));

    const updateWorkspaceStates = () => {
      workspaceStates = workspaceStates.map(ws => ({
        ...ws,
        focused: Hyprland.active.workspace.id === ws.id,
        hasWindows: Hyprland.workspaces.some(workspace => workspace.id === ws.id && workspace.windows > 0),
      }));
    };

    const createWorkspaceButton = (ws: { focused: any; hasWindows: any; id: string | number; }) => {
      const className = ws.focused ? "focused" : ws.hasWindows ? "work" : "";
      return Widget.Button({
        onClicked: () => execAsync(`/usr/bin/hyprctl dispatch workspace ${ws.id}`),
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
