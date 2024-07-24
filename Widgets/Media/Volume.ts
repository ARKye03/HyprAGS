const audio = await Service.import("audio");

export const Volume = () =>
  Widget.Button({
    className: "volume",
    on_scroll_up: () =>
      (audio.speaker.volume = Math.min(1, audio.speaker.volume + 0.05)),
    on_scroll_down: () =>
      (audio.speaker.volume = Math.max(0, audio.speaker.volume - 0.05)),
    on_primary_click_release: () =>
      (audio.speaker.is_muted = !audio.speaker.is_muted),
    child: Widget.Box({
      setup: (self) => {
        const updateVolume = () => {
          const volumeIcon = Widget.Icon().hook(audio.speaker, (self) => {
            const category = {
              101: "overamplified",
              67: "high",
              34: "medium",
              1: "low",
              0: "muted",
            };

            const icon = audio.speaker.is_muted
              ? 0
              : [101, 67, 34, 1, 0].find(
                  (threshold) => threshold <= audio.speaker.volume * 100
                );

            self.icon = `audio-volume-${
              category[icon as keyof typeof category]
            }-symbolic`;
          });

          const volumeLabel = Widget.Label({
            label: `   ${Math.round(audio.speaker.volume * 100)}`,
          });

          self.children = [volumeIcon, volumeLabel];
        };

        self.hook(audio.speaker, updateVolume, "notify::volume");
        updateVolume();
      },
    }),
  });
