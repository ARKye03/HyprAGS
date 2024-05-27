import { icons } from "assets/Assets";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";

const PopulateClipboard = () => {
  return execAsync("cliphist list").then((output) => {
    // Split the output by lines and create a Widget.Label for each line
    return output.split("\n").map((line) => Widget.Label({ label: line }));
  });
};

export const ClipboardManager = () =>
  Widget.Window({
    name: "cliphist",
    class_name: "cliphist",
    exclusivity: "normal",
    visible: false,
    keymode: "on-demand",
    child: Widget.Box({
      class_name: "cliphist_master_box",
      vertical: true,
      children: [
        Widget.Box({
          class_name: "clip_entry_box",
          children: [
            Widget.Icon({
              size: 25,
              icon: icons.Clipboard,
            }),
            Widget.Entry({}),
          ],
        }),
        Widget.Scrollable({
          child: Widget.Box({
            vertical: true,
            children: [],
          }),
        }),
      ],
    }),
  });
