import { icons } from "assets/Assets";
import { execAsync } from "resource:///com/github/Aylur/ags/utils/exec.js";
import { Globals } from "Widgets/userVars";

const notifications = await Service.import("notifications");
notifications.popupTimeout = 5000;

const popups = notifications.bind("popups");

/** @param {import('resource:///com/github/Aylur/ags/service/notifications.js').Notification} n */
const Notification = (n: {
  summary: any;
  body: any;
  actions: { id: any; label: any }[];
  invoke: (arg0: any) => void;
  dismiss: () => unknown;
  urgency: any;
}) => {
  const title = Widget.Label({
    class_name: "title",
    xalign: 0,
    justification: "left",
    hpack: "center",
    hexpand: true,
    max_width_chars: 24,
    truncate: "end",
    wrap: true,
    label: n.summary,
    use_markup: true,
  });

  const body = Widget.Label({
    class_name: "body",
    hexpand: true,
    use_markup: true,
    xalign: 0,
    lines: 2,
    truncate: "end",
    justification: "left",
    label: n.body,
    wrap: true,
  });

  const actions = Widget.Box({
    class_name: "actions",
    children: n.actions.map(({ id, label }) =>
      Widget.Button(
        {
          class_name:
            n.actions.length === 1 ? "lonely_action_button" : "action_button",
          on_clicked: () => n.invoke(id),
          hexpand: true,
        },
        Widget.Label(label)
      )
    ),
  });

  const notificationsActions = Widget.Revealer({
    transition: "slide_down",
    transition_duration: 300,
    reveal_child: false,
    child: actions,
  });
  //execAsync(`paplay ${Globals.HOME}/.dotfiles/public/notification.wav`);
  return Widget.EventBox(
    {
      on_primary_click: () => n.dismiss(),
      on_hover: () => notificationsActions.reveal_child = true,
      on_hover_lost: () => notificationsActions.reveal_child = false,
    },
    Widget.Box(
      {
        class_name: `notification ${n.urgency}`,
      },
      Widget.Icon({
        class_name: "notification_pop_icon",
        size: 40,
        icon:
          n.urgency === "low"
            ? icons.lowPop
            : n.urgency === "normal"
              ? icons.normalPop
              : n.urgency === "critical"
                ? icons.criticalPop
                : icons.moodSad,
      }),
      Widget.Box(
        {
          vertical: true,
          class_name: "notification_pop_data",
        },
        Widget.Box(
          {
            vertical: true,
            spacing: 10,
          },
          title,
          body
        ),
        notificationsActions
      )
    )
  );
};

export const notificationPopup = Widget.Window(
  {
    name: "notifications",
    anchor: ["top", "right", "bottom"],
  },
  Widget.Box({
    class_name: "notifications",
    vertical: true,
    children: popups.as((popups) => popups.map(Notification)),
  })
);
