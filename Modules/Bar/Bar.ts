import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Workspaces from "../Workspaces/Switch";
import { MusicPlayerDaemon } from "../Media/MusicPlayerDaemon";
import { AppLauncher, PowerMenu } from "./BorderMenus";
import { Volume } from "../Media/Volume";
import { SysTray } from "./SysTray";
import { Clock } from "./Clock";
import { NetworkIndicator } from "./Network";

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
    children: [Volume(), NetworkIndicator(), Clock(), SysTray(), PowerMenu],
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
