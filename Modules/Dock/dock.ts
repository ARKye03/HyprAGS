import { icons } from "assets/Assets";
import Gio from "gi://Gio";
import { Globals } from "Modules/userVars";
import { exec, execAsync } from "resource:///com/github/Aylur/ags/utils.js";
const BraveBrowser = Gio.DesktopAppInfo.new_from_filename(
  `${Globals.HOME}/.local/share/applications/brave-browser.desktop`
);

const VSCode = Gio.DesktopAppInfo.new("code.desktop");

const rev = Widget.Revealer(
  {
    reveal_child: false,
    transition: "slide_up",
    transition_duration: 300,
  },
  Widget.Box(
    { class_name: "dock_box_apps", spacing: 10 },
    Widget.Button({
      image: Widget.Icon({
        icon: BraveBrowser.get_icon()?.to_string() ?? "",
        size: 45,
      }),
      vpack: "center",
      hpack: "center",
      on_clicked: () => BraveBrowser.launch_action("new-window", null),
    }),
    Widget.Button({
      image: Widget.Icon({
        icon: VSCode.get_icon()?.to_string() ?? "",
        size: 45,
      }),
      vpack: "center",
      hpack: "center",
      on_clicked: () => {
        if (exec("pgrep -x code").length > 0)
          execAsync("hyprctl dispatch focuswindow code");
        else VSCode.launch_action(VSCode.list_actions()[0], null);
      },
    }),

    Widget.Button({
      image: Widget.Icon({ icon: icons.PowerButton, size: 45 }),
      vpack: "center",
      hpack: "center",
    }),
    Widget.Button({
      image: Widget.Icon({ icon: icons.stopSvg, size: 45 }),
      vpack: "center",
      hpack: "center",
    }),
    Widget.Button({
      image: Widget.Icon({ icon: icons.moodSad, size: 45 }),
      vpack: "center",
      hpack: "center",
    })
  )
);
export const Dock = () =>
  Widget.Window(
    {
      name: "Dock",
      anchor: ["bottom"],
      visible: true,

      setup: (self) =>
        self
          .on("enter-notify-event", () => (rev.reveal_child = true))
          .on("leave-notify-event", () => (rev.reveal_child = false)),
    },
    Widget.EventBox(
      {
        class_name: "dock_event_box",
      },
      Widget.Box(
        {
          css: "padding: 1px",
          class_name: "dock_box",
        },
        rev
      )
    )
  );
