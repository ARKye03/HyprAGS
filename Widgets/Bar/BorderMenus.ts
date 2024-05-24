import { icons } from "assets/Assets";
import Widget from "resource:///com/github/Aylur/ags/widget.js";

export const PowerMenu = Widget.Button({
  className: "top_sys_button_menu",
  child: Widget.Icon({
    icon: icons.PowerButton,
    size: 20,
    hpack: "center",
  }),
  on_primary_click_release: () => App.ToggleWindow("SideDash"),
});
export const AppLauncher = Widget.Button({
  className: "top_sys_button_menu",
  child: Widget.Icon({
    icon: icons.AppLauncher,
    size: 20,
    hpack: "center",
  }),
  on_clicked: () => App.ToggleWindow("applauncher"),
});
