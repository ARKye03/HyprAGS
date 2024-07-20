import Audio from "resource:///com/github/Aylur/ags/service/audio.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";

export const Volume = () =>
  Widget.Button({
    className: "volume",
    on_scroll_up: () =>
      (Audio.speaker.volume = Math.min(1, Audio.speaker.volume + 0.05)),
    on_scroll_down: () =>
      (Audio.speaker.volume = Math.max(0, Audio.speaker.volume - 0.05)),
    on_primary_click_release: () =>
      (Audio.speaker.is_muted = !Audio.speaker.is_muted),
    child: Widget.Box({
      setup: (self) => {
        const updateVolume = () => {
          const volumeIcon = Widget.Icon().hook(Audio.speaker, (self) => {
            const category = {
              101: "overamplified",
              67: "high",
              34: "medium",
              1: "low",
              0: "muted",
            };

            const icon = Audio.speaker.is_muted
              ? 0
              : [101, 67, 34, 1, 0].find(
                  (threshold) => threshold <= Audio.speaker.volume * 100
                );

            self.icon = `audio-volume-${
              category[icon as keyof typeof category]
            }-symbolic`;
          });

          const volumeLabel = Widget.Label({
            label: `   ${Math.round(Audio.speaker.volume * 100)}`,
          });

          self.children = [volumeIcon, volumeLabel];
        };

        self.hook(Audio, updateVolume, "speaker-changed");
        updateVolume();
      },
    }),
  });
