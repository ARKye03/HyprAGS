import { icons } from "assets/Assets";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";

const MidBox = Widget.Box({
  homogeneous: true,
  spacing: 20,
  children: [
    Widget.Button({
      on_primary_click_release: () => execAsync("hyprlock"),
      child: Widget.Icon({
        icon: icons.SysLock,
        size: 25,
        hpack: "center",
      }),
    }),
    Widget.Button({
      on_primary_click_release: () => execAsync("systemctl suspend"),
      child: Widget.Icon({
        icon: icons.SysSuspend,
        size: 25,
        hpack: "center",
      }),
    }),
    Widget.Button({
      on_primary_click_release: () =>
        execAsync('notify-send "This doesn\'t work xd"'),
      child: Widget.Icon({
        icon: icons.SysLogout,
        size: 25,
        hpack: "center",
      }),
    }),
    Widget.Button({
      on_primary_click_release: () => execAsync("systemctl reboot"),
      child: Widget.Icon({
        icon: icons.SysReboot,
        size: 25,
        hpack: "center",
      }),
    }),
    Widget.Button({
      on_primary_click_release: () => execAsync("systemctl poweroff"),
      child: Widget.Icon({
        icon: icons.SysOff,
        size: 25,
        hpack: "center",
      }),
    }),
  ],
});
const UpperBox = Widget.CenterBox({
  class_name: "side_dash_title",
  homogeneous: false,
  start_widget: Widget.Label(),
  center_widget: Widget.Label("Hello World!"),
  end_widget: Widget.Button({
    class_name: "side_dash_sys_button",
    hpack: "end",
    child: Widget.Icon({
      icon: icons.PowerButton,
      class_name: "sdsb",
      size: 25,
      hpack: "end",
      hexpand: true,
    }),
  }),
});
export const SideDash = () =>
  Widget.Window({
    anchor: ["top", "right", "bottom"],
    name: "SideDash",
    class_name: "side_dash",
    visible: false,
    child: Widget.Box({
      css: "padding: 1px;",
      child: Widget.Revealer({
        revealChild: false,
        transitionDuration: 150,
        transition: "slide_left",
        setup: (self) => {
          self.hook(
            App,
            (self, windowName, visible) => {
              if (windowName === "SideDash") {
                self.reveal_child = visible;
              }
            },
            "window-toggled"
          );
        },
        child: Widget.Box({
          class_name: "side_dash_box",
          expand: true,
          vertical: true,
          children: [UpperBox, MidBox, Widget.Box(), Widget.Box()],
        }),
      }),
    }),
  });
