import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Workspaces from "../Workspaces/Switch";
import { MusicPlayerDaemon } from "../Media/MusicPlayerDaemon";
import { AppLauncher, PowerMenu } from "./BorderMenus";
import { Volume } from "../Media/Volume";
import { SysTray } from "./SysTray";
import { Clock } from "./Clock";
import { NetworkIndicator } from "./Network";

const battery = await Service.import("battery");

const batteryProgress = Widget.Box(
  { class_name: "battery_box" },
  Widget.CircularProgress({
    child: Widget.Icon({
      icon: battery.bind("icon_name"),
    }),
    visible: battery.bind("available"),
    value: battery.bind("percent").as((p) => (p > 0 ? p / 100 : 0)),
    class_name: battery.bind("charging").as((ch) => (ch ? "charging" : "idle")),
  })
);

const Left = () =>
  Widget.Box({
    children: [AppLauncher, Workspaces()],
  });
const Center = () =>
  Widget.Box({
    children: [MusicPlayerDaemon],
  });
const Right = () =>
  Widget.Box({
    hpack: "end",
    children: [
      Volume(),
      NetworkIndicator(),
      Clock(),
      SysTray(),
      batteryProgress,
      PowerMenu,
    ],
  });
export default (monitor = 0) =>
  Widget.Window({
    name: `bar-${monitor}`,
    class_name: "bar",
    monitor,
    anchor: ["top", "left", "right"],
    exclusivity: "exclusive",
    child: Widget.CenterBox({
      start_widget: Left(),
      center_widget: Center(),
      end_widget: Right(),
    }),
  });
