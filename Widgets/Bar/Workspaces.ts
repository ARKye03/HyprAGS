import AstalRiver from "gi://AstalRiver";
import Widget from "resource:///com/github/Aylur/ags/widget.js";

const river = AstalRiver.River.get_default();
const mainOutput = AstalRiver.River.get_default().get_output("HDMI-A-1");

function applyCssToWs(box) {
  if (mainOutput == null) return;
  const focused = mainOutput.focused_tags;
  const occupied = mainOutput.occupied_tags;
  box.children.forEach((button, i) => {
    button.toggleClassName("wsb-occupied", occupied & (1 << (i)));
    button.toggleClassName("wsb-active", focused & (1 << (i)));
  });
}

const WorkspaceButton = (i: number) => Widget.EventBox({
  class_name: "ws-button",
  on_primary_click_release: () => {
    river.run_command_async(["set-focused-tags", `${1 << (i - 1)}`], null);
  },
  on_secondary_click_release: (self) => {
    const tags = mainOutput.get_focused_tags() ^ (1 << (i - 1));
    river.run_command_async(["set-focused-tags", `${tags}`], null);
  },
  on_middle_click_release: () => {
    river.run_command_async(["set-view-tags", `${1 << (i - 1)}`], null);
  },
  child: Widget.Label({
    label: `${i}`,
    class_name: "ws-button-label"
  })
});

export const Workspaces = () => {
  return Widget.EventBox({
    child: Widget.Box({
      spacing: 5,
      class_name: "ws-container",
      children: Array.from({ length: 9 }, (_, i) => i + 1).map(i => WorkspaceButton(i)),
    })
      .hook(river, applyCssToWs, "changed")
  });
};


export default Workspaces;