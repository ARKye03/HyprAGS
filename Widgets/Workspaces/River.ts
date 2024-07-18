import AstalRiver from "gi://AstalRiver";
import Widget from "resource:///com/github/Aylur/ags/widget.js";

const river = AstalRiver.River.get_default();
const mainOutput = AstalRiver.River.get_default().get_output("HDMI-A-1");

const Wicons = {
    1: " ",
    2: " ",
    3: "󰨞 ",
    4: " ",
    5: " ",
    6: "󰭹 ",
    7: " ",
    8: " ",
    9: "󰊖 ",
};


function ModCss(box: { children: any[]; }) {
    if (mainOutput == null) return;
    const focused = mainOutput.focused_tags;
    const occupied = mainOutput.occupied_tags;
    box.children.forEach((button: { toggleClassName: (arg0: string, arg1: number) => void; }, i: any) => {
        button.toggleClassName("wsb-occupied", occupied & (1 << (i)));
        button.toggleClassName("wsb-active", focused & (1 << (i)));
    });
}

const WorkspaceButton = (i: number) => Widget.EventBox({
    class_name: "ws-button",
    on_primary_click_release: () => {
        river.run_command_async(["set-focused-tags", `${1 << (i - 1)}`], null);
    },
    on_secondary_click_release: (_self) => {
        const tags = mainOutput.get_focused_tags() ^ (1 << (i - 1));
        river.run_command_async(["set-focused-tags", `${tags}`], null);
    },
    on_middle_click_release: () => {
        river.run_command_async(["set-view-tags", `${1 << (i - 1)}`], null);
    },
    child: Widget.Label({
        label: `${Wicons[i]}`,
        class_name: "ws-button-label"
    })
});

export default () => {
    return Widget.EventBox({
        child: Widget.Box({
            spacing: 5,
            class_name: "ws-container",
            children: Array.from({ length: 9 }, (_, i) => i + 1).map(i => WorkspaceButton(i)),
        })
            .hook(river, ModCss, "changed")
    });
};
