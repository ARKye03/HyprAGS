import { icons } from "assets/Assets";
import Gio from "gi://Gio";
import { Globals } from "Modules/userVars";
const a = Gio.DesktopAppInfo.new_from_filename(
  `${Globals.HOME}/.local/share/applications/brave-browser.desktop`
);
console.log(a);
console.log(a.list_actions());
const rev = Widget.Revealer(
  {
    reveal_child: false,
    transition: "slide_up",
    transition_duration: 300,
  },
  Widget.Box(
    { class_name: "dock_box_apps", spacing: 10 },
    Widget.Button({
      image: Widget.Icon({ icon: icons.AppLauncher, size: 45 }),
      vpack: "center",
      hpack: "center",
      on_clicked: () => a.launch_action("new-window", null),
    }),
    Widget.Button({
      image: Widget.Icon({ icon: icons.ArchLogo, size: 45 }),
      vpack: "center",
      hpack: "center",
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
