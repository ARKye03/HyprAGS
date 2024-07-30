import { icons, wallpapers } from "assets/Assets";
import { Globals } from "Modules/userVars";
import { execAsync } from "resource:///com/github/Aylur/ags/utils/exec.js";
import PopupWindow from "Widgets/PopupWindow";

const WINDOW_NAME = "powermenu";

const powerButton = (icon: string, action: () => void) =>
  Widget.Button({
    image: Widget.Icon({ icon, size: 75 }),
    on_clicked: action,
    vpack: "center",
    hpack: "center",
  });

const powerBox = () =>
  Widget.Box(
    {
      class_name: "powerBox_master",
      spacing: 10,
    },
    Widget.Box(
      {
        class_name: "powerBox_left_box",
        css: `background-image: url('${wallpapers.archBlack}');`,
        homogeneous: true,
        hexpand: true,
        vertical: true,
        vexpand: true,
      },
      Widget.Label({
        class_name: "powerBox_left_box_upper_label",
        vpack: "start",
        label: `Goodbye ${Globals.CurrentUser}!`,
      }),
      Widget.Label({
        label: "Dolor fugiat laboris mollit",
        vpack: "end",
      })
    ),
    Widget.Box(
      {
        class_name: "powerBox_right_box",
        homogeneous: true,
        hexpand: true,
      },
      Widget.Box(
        {
          class_name: "powerBox_r_l",
          vertical: true,
          vexpand: true,
          homogeneous: true,
        },
        powerButton(icons.SysLock, () => execAsync("hyprlock")),
        powerButton(icons.SysLogout, () =>
          execAsync('notify-send "Work In Progress"')
        ),
        powerButton(icons.PowerButton, () => execAsync("systemctl poweroff"))
      ),
      Widget.Box(
        {
          class_name: "powerBox_r_r",
          vertical: true,
          vexpand: true,
          homogeneous: true,
        },
        powerButton(icons.SysReboot, () => execAsync("systemctl reboot")),
        powerButton(icons.SysSuspend, () => execAsync("systemctl suspend")),
        powerButton(icons.moodSad, () => execAsync("notify-send 'Hello mate'"))
      )
    )
  );

export default PopupWindow({
  name: WINDOW_NAME,
  transition_type: "crossfade",
  keymode: "exclusive",
  setup: (self: { keybind: (arg0: string, arg1: () => void) => any }) =>
    self.keybind("Escape", () => {
      App.closeWindow(WINDOW_NAME);
    }),
  child: powerBox(),
});
