import GLib from "types/@girs/glib-2.0/glib-2.0";
const audio = await Service.import("audio");

export function VolumeOSD() {
  const Volume = () => {
    const icons = {
      101: "overamplified",
      67: "high",
      34: "medium",
      1: "low",
      0: "muted",
    };

    function getIcon() {
      const icon = audio.speaker.is_muted
        ? 0
        : [101, 67, 34, 1, 0].find(
            (threshold) => threshold <= audio.speaker.volume * 100
          );

      return `audio-volume-${icons[icon ?? 0]}-symbolic`;
    }

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

    return Widget.Box({
      class_name: "volume",
      css: "min-width: 180px",
      children: [icon, slider],
    });
  };
  const window = Widget.Window(
    {
      name: "volume_osd",
      anchor: ["bottom"],
      css: "border-radius: 10px;",
      visible: false, // initially hidden
    },
    Volume()
  );

  // Watch for changes in the volume and show the window
  let hideTimeoutId: number | null = null;

  Utils.watch(
    () => audio.speaker.volume,
    [audio.speaker], // Pass audio.speaker as an array
    () => {
      window.visible = true;
      // Clear the previous timeout
      if (hideTimeoutId !== null) {
        GLib.source_remove(hideTimeoutId);
      }
      // Hide the window after 2 seconds
      hideTimeoutId = Utils.timeout(2000, () => {
        window.visible = false;
      });
    }
  );

  return window;
}
