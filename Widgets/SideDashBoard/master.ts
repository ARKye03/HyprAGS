import { icons } from "assets/Assets";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import GLib from "types/@girs/glib-2.0/glib-2.0";

const network = await Service.import("network");
const Notification = await Service.import("notifications");
Notification.popupTimeout = 3000;
Notification.forceTimeout = false;
Notification.cacheActions = false;
Notification.clearDelay = 50;

const CurrentUser = GLib.getenv("USER");
const HOME = GLib.getenv("HOME");

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
  start_widget: Widget.Box({
    class_name: "side_dash_title_start",
    children: [
      Widget.Button({
        class_name: "side_dash_sys_button",
        hpack: "start",
        child: Widget.Icon({
          class_name: "side_dash_sys_button_toggleVPN",
          icon: network.vpn
            .bind("activated_connections")
            .as((state) =>
              state.some((connection) => connection.state === "connected")
                ? icons.ToggleVPN_on
                : icons.ToggleVPN_off
            ),
          size: 25,
          hpack: "start",
          hexpand: false,
        }),
        on_primary_click_release: () =>
          execAsync(`${HOME}/.dotfiles/scripts/toggle_vpn.sh`),
      }),
      Widget.Button({
        class_name: "side_dash_sys_button",
        hpack: "start",
        child: Widget.Icon({
          icon: icons.ArchLogo,
          size: 25,
          hpack: "start",
          hexpand: false,
        }),
        on_primary_click_release: () =>
          execAsync("hyprctl dispatch togglespecialworkspace"),
      }),
    ],
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
      NotificationCenter.class_name = NotificationCenter.class_name.includes(
        "active"
      )
        ? "side_dash_notifications_scroll"
        : "side_dash_notifications_scroll active";
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
    class_name: "side_dash_mid_box",
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
          execAsync('notify-send "Work In Progress"'),
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

function createNotificationBox(notification: {
  urgency: any;
  summary: any;
  body: any;
  dismiss: () => unknown;
}) {
  return Widget.Box({
    vertical: true,
    children: [
      Widget.Label({
        class_name: `notification-title-${notification.urgency}`,
        justification: "center",
        use_markup: true,
        wrap: true,
        label: notification.summary,
      }),
      Widget.Label({
        class_name: "notification-body",
        justification: "center",
        use_markup: true,
        wrap: true,
        label: notification.body,
        max_width_chars: 20,
      }),
      // Widget.Button({
      //   hpack: "end",
      //   hexpand: true,
      //   on_primary_click_release: () => notification.dismiss(),
      //   child: Widget.Icon({
      //     icon: icons.closeChatSvg,
      //     size: 20,
      //   }),
      // }),
    ],
  });
}

const NotificationCenter = Widget.Scrollable({
  class_name: "side_dash_notifications_scroll",
  child: Widget.Box({
    vertical: true,
    children: Notification.bind("notifications").as((notifications) =>
      notifications.map(createNotificationBox)
    ),
  }),
});

const NotificationsCenter = Widget.Box({
  class_name: "side_dash_notifications",
  vertical: true,
  children: [
    Widget.CenterBox({
      class_name: "side_dash_notifications_title",
      start_widget: Widget.Box(),
      center_widget: Widget.Label({
        hpack: "center",
        hexpand: true,
        label: Notification.bind("notifications").as(
          (n) => `There are ${n.length} notifications`
        ),
      }),
      end_widget: Widget.Button({
        hpack: "end",
        on_primary_click_release: () => Notification.clear(),
        child: Widget.Icon({
          icon: icons.trashNotificationsSvg,
          size: 20,
        }),
      }),
    }),
    NotificationCenter,
  ],
});

const Calendar = Widget.Calendar({
  class_name: "side_dash_calendar",
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
          children: [UpperBox, MidBox, Calendar, NotificationsCenter],
        }),
      }),
    }),
  });
