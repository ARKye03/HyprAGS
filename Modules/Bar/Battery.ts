const battery = await Service.import("battery");

export const batteryProgress = Widget.Box(
  { class_name: "battery_box" },
  Widget.CircularProgress({
    child: Widget.Label({
      label: battery.bind("percent").as((p) => `${p}`),
    }),
    visible: battery.bind("available"),
    value: battery.bind("percent").as((p) => (p > 0 ? p / 100 : 0)),
    class_name: battery.bind("percent").as((p) => {
      if (p < 20) {
        return "low_charge";
      }
      return battery.charging ? "charging" : "idle";
    }),
  })
);