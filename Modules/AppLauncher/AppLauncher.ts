import Gtk from "gi://Gtk";
import PopupWindow from "Widgets/PopupWindow";

const { query } = await Service.import("applications");
const WINDOW_NAME = "applauncher";

/** @param {import('resource:///com/github/Aylur/ags/service/applications.js').Application} app */
const AppItem = (app: {
  [x: string]: any;
  launch: () => void;
  icon_name: any;
  name: any;
}) =>
  Widget.Button({
    on_clicked: () => {
      App.closeWindow(WINDOW_NAME);
      app.launch();
    },
    attribute: { app },
    child: Widget.Box({
      spacing: 10,
      children: [
        Widget.Icon({
          icon: app.icon_name || "",
          size: 42,
        }),
        Widget.Label({
          class_name: "title",
          label: app.name,
          xalign: 0,
          vpack: "center",
          truncate: "end",
        }),
      ],
    }),
  });
const Applauncher = ({ width = 500, height = 500, spacing = 12 }) => {
  let applications = query("").map(AppItem);
  const grid = new Gtk.Grid({
    column_spacing: spacing,
    row_spacing: spacing,
    column_homogeneous: true,
  });

  function repopulate() {
    grid.foreach((child: any) => grid.remove(child));
    let visibleApps = applications.filter((app) => app.visible);
    visibleApps.forEach((app, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      grid.attach(app, col, row, 1, 1);
    });
  }

  const entry = Widget.Entry({
    hexpand: true,
    css: `margin-bottom: ${spacing}px;`,

    on_accept: () => {
      if (applications[0]) {
        App.toggleWindow(WINDOW_NAME);
        applications[0].attribute.app.launch();
      }
    },

    on_change: ({ text }) => {
      applications.forEach((item) => {
        item.visible = item.attribute.app.match(text ?? "");
      });
      repopulate();
    },
  });

  return Widget.Box({
    vertical: true,
    class_name: "applauncher_box",
    children: [
      entry,

      Widget.Scrollable({
        hscroll: "never",
        css: `min-width: ${width}px;` + `min-height: ${height}px;`,
        child: grid,
      }),
    ],
    setup: (self) =>
      self.hook(App, (_, windowName, visible) => {
        if (windowName !== WINDOW_NAME) return;

        if (visible) {
          repopulate();
          entry.text = "";
          entry.grab_focus();
        }
      }),
  });
};

export default PopupWindow({
  name: WINDOW_NAME,
  transition_type: "crossfade",
  setup: (self: { keybind: (arg0: string, arg1: () => void) => any }) =>
    self.keybind("Escape", () => {
      App.closeWindow(WINDOW_NAME);
    }),
  keymode: "exclusive",
  child: Applauncher({
    width: 600,
    height: 300,
    spacing: 12,
  }),
});
