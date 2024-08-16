import GLib from "types/@girs/glib-2.0/glib-2.0";
import PopupWindow from "Widgets/PopupWindow";
const audio = await Service.import("audio");
import brightness from "../../Services/Brigthness";

const TIMEOUT_DESPAWN = 1000;
const WINDOW_NAME = "volume_osd";

const Brightness = () =>
  Widget.Box(
    { class_name: "brightness_osd_box" },
    Widget.Label({
      hpack: "center",

      label: brightness
        .bind("screen_value")
        .as((v) => `B => ${Math.round(v * 100)}%`),
    }),
    Widget.Slider({
      on_change: (self) => (brightness.screen_value = self.value),
      hexpand: true,
      draw_value: false,
      value: brightness.bind("screen_value"),
    })
  );
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
  const label = Widget.Label({
    label: audio.speaker
      .bind("volume")
      .as((v) => `V => ${Math.round(v * 100)}%`),
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
    slider,
    label
  );
};
enum osd_types {
  volume,
  brightness,
}
export default function OSD() {
  const Switch = Widget.Stack({
    children: {
      child1: Volume(),
      child2: Brightness(),
    },
    shown: "child1",
  })
    .hook(audio.speaker, TriggerOSD(osd_types.volume), "notify::volume")
    .hook(brightness, TriggerOSD(osd_types.brightness), "screen-changed");

  let hideTimeoutId: number | null = null;

  function showOSDChild(type: osd_types): void {
    if (type === osd_types.volume) {
      Switch.shown = "child1";
    } else if (type === osd_types.brightness) {
      Switch.shown = "child2";
    }
  }

  function handleTimeout(): void {
    if (hideTimeoutId !== null) {
      GLib.source_remove(hideTimeoutId);
    }
    hideTimeoutId = Utils.timeout(TIMEOUT_DESPAWN, () => {
      window.visible = false;
    });
  }

  function TriggerOSD(type: osd_types): (self: any, ...args: any[]) => void {
    return () => {
      showOSDChild(type);
      window.visible = true;
      handleTimeout();
    };
  }

  const window = PopupWindow({
    name: WINDOW_NAME,
    anchor: ["bottom"],
    layer: "overlay",
    transition_type: "slide_up",
    child: Switch,
  });

  return window;
}
