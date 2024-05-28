import { icons } from "assets/Assets";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";

//It works, but it's kinda meh the way cliphist works, so it's not worth it

const WINDOW_NAME = "cliphist";
const clips = async () => {
  try {
    const clipList = await Utils.execAsync(
      'bash -c "cliphist list | awk \'{\\$1=\\"\\"; print}\'"'
    );
    const items = clipList.split("\n");
    console.log(items);
    return items;
  } catch (err) {
    console.error(err);
    return [];
  }
};
export const ClipboardManager = async () => {
  const clipItems = await clips();
  const clipButtons = clipItems.map((item) =>
    Widget.Button({
      child: Widget.Label(item),
      onClicked: () => {
        execAsync(`wl-copy ${item}`);
        App.closeWindow(WINDOW_NAME);
      },
    })
  );
  return Widget.Window({
    name: "cliphist",
    class_name: "cliphist",
    exclusivity: "normal",
    visible: false,
    keymode: "exclusive",
    child: Widget.Box({
      class_name: "cliphist_master_box",
      vertical: true,
      spacing: 10,
      children: [
        Widget.Box({
          class_name: "clip_entry_box",
          spacing: 10,
          children: [
            Widget.Icon({
              size: 25,
              icon: icons.Clipboard,
            }),
            Widget.Entry({
              hexpand: true,
            }),
          ],
        }),
        Widget.Scrollable({
          class_name: "clip_scroll_box",
          hscroll: "never",
          vscroll: "automatic",
          child: Widget.Box({
            vertical: true,
            spacing: 10,
            children: clipButtons,
          }),
        }),
      ],
    }),
  });
};
