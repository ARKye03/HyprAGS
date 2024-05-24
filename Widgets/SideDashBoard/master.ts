import { icons } from "assets/Assets";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import GLib from "types/@girs/glib-2.0/glib-2.0";

const CurrentUser = GLib.getenv("USER");

//Yes or no widget
const YesNoWidget = Widget.Box({
  class_name: "yes_no_widget",
  spacing: 10,
  children: [
    Widget.Label("Yes"),
    Widget.Button({
      on_primary_click_release: () => execAsync("notify-send 'Yes'"),
      child: Widget.Icon({
        icon: icons.Pacman,
        size: 25,
        hpack: "center",
      }),
    }),
    Widget.Label("No"),
    Widget.Button({
      on_primary_click_release: () => execAsync("notify-send 'No'"),
      child: Widget.Icon({
        icon: icons.Pacman,
        size: 25,
        hpack: "center",
      }),
    }),
  ],
});

const UpperBox = Widget.CenterBox({
  class_name: "side_dash_title",
  hexpand: true,
  start_widget: Widget.Button({
    class_name: "side_dash_sys_button",
    hpack: "start",
    child: Widget.Icon({
      icon: icons.ToggleVPN,
      size: 25,
      hpack: "start",
      hexpand: false,
    }),
    on_primary_click_release: () =>
      execAsync(`~/.dotfiles/scripts/toggle_vpn.sh`),
  }),
  center_widget: Widget.Label({
    hpack: "fill",
    hexpand: true,
    label: `Hello ${CurrentUser}!`,
  }),
  end_widget: Widget.Button({
    class_name: "side_dash_sys_button",
    hpack: "end",
    hexpand: false,
    child: Widget.Icon({
      icon: icons.PowerButton,
      class_name: "sdsb",
      size: 25,
      hpack: "end",
      hexpand: false,
    }),
    on_primary_click_release: () => {
      MidBox.reveal_child = !MidBox.reveal_child;
    },
  }),
});
let MidBox = Widget.Revealer({
  revealChild: false,
  transitionDuration: 300,
  transition: "slide_down",
  child: Widget.Box({
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
          children: [UpperBox, MidBox, Widget.Label("Hello World!")],
        }),
      }),
    }),
  });
