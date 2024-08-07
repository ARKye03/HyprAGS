import GLib from "types/@girs/glib-2.0/glib-2.0";
import PopupWindow from "Widgets/PopupWindow";
const audio = await Service.import("audio");

const TIMEOUT_DESPAWN = 1000;
const WINDOW_NAME = "volume_osd";

export default function VolumeOSD() {
  const Volume = () => {
    const icons = {
      101: "overamplified",
      67: "high",
      34: "medium",
      1: "low",
      0: "muted",
    };

    const getIcon = () => {
      const icon = audio.speaker.is_muted
        ? 0
        : [101, 67, 34, 1, 0].find(
            (threshold) => threshold <= audio.speaker.volume * 100
          );

      return `audio-volume-${icons[icon ?? 0]}-symbolic`;
    };

    const icon = Widget.Icon({
      icon: Utils.watch(getIcon(), audio.speaker, getIcon),
    });

    const slider = Widget.Slider({
      hexpand: true,
      draw_value: false,
      on_change: ({ value }) => (audio.speaker.volume = value),
      setup: (self) =>
        self.hook(audio.speaker, () => {
          self.value = audio.speaker.volume || 0;
        }),
    });

    return Widget.Box(
      {
        class_name: "volume_osd_box",
      },
      icon,
      slider
    ).hook(audio.speaker, TriggerOSD, "notify::volume");
  };

  let hideTimeoutId: number | null = null;
  function TriggerOSD() {
    window.visible = true;
    if (hideTimeoutId !== null) {
      GLib.source_remove(hideTimeoutId);
    }
    hideTimeoutId = Utils.timeout(TIMEOUT_DESPAWN, () => {
      window.visible = false;
    });
  }

  const window = PopupWindow({
    name: WINDOW_NAME,
    anchor: ["bottom"],
    transition_type: "slide_up",
    child: Volume(),
  });

  return window;
}
