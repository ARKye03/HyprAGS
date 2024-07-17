import AstalRiver from "gi://AstalRiver";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Gdk from "gi://Gdk";
import { EventBox } from "resource:///com/github/Aylur/ags/widgets/eventbox.js";
import { Label } from "resource:///com/github/Aylur/ags/widgets/label.js";

const river = AstalRiver.River.get_default();
const display = Gdk.Display.get_default();

function getRiverOutput(widget: EventBox<Label<unknown>, unknown>) {
  const gdkmonitor = display?.get_monitor_at_window(widget.get_window() as Gdk.Window);
  const monitor_name = Utils.getMonitorName(gdkmonitor);
  return river.get_output(monitor_name);
}

function applyCssToWs(box: EventBox<Label<unknown>, unknown>) {
  const output = getRiverOutput(box);
  if (output == null) return;
  const focused = output.focused_tags;
  const occupied = output.occupied_tags;
  box.children.forEach((button: { toggleClassName: (arg0: string, arg1: number | boolean) => void; }, i: number) => {
    button.toggleClassName("occupied", occupied & (1 << (i)));
    button.toggleClassName("occupied-left", i == 0 || !(occupied & (1 << (i - 1))));
    button.toggleClassName("occupied-right", i == 8 || !(occupied & (1 << (i + 1))));
    button.toggleClassName("active", focused & (1 << (i)));
    button.toggleClassName("active-left", i == 0 || !(focused & (1 << (i - 1))));
    button.toggleClassName("active-right", i == 8 || !(focused & (1 << (i + 1))));
  });
}

/** @param {number} i */
const WorkspaceButton = (i: number) => Widget.EventBox({
  class_name: "ws-button",
  //NOTE: i would perfer shift/ctrl-click fo different behaviour
  //but i can't get the modifier keys without also havin keyboard focus
  on_primary_click_release: () => {
    river.run_command_async(["set-focused-tags", `${1 << (i - 1)}`], null);
  },
  on_secondary_click_release: (self) => {
    const output = getRiverOutput(self);
    const tags = output.get_focused_tags() ^ (1 << (i - 1));
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
      class_name: "ws-container",
      children: Array.from({ length: 9 }, (_, i) => i + 1).map(i => WorkspaceButton(i)),
    })
      .hook(river, applyCssToWs, "changed")
  });
};


export default Workspaces;