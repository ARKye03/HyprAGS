import GLib from "types/@girs/glib-2.0/glib-2.0";
import PopupWindow from "Widgets/PopupWindow";
const audio = await Service.import("audio");

const TIMEOUT_DESPAWN = 1000;
const WINDOW_NAME = "volume_osd";

const Volume = () => {
  const label = Widget.Label({
    label: audio.speaker.bind("volume").as((v) => `${Math.round(v * 100)}%`),
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
    label,
    slider
  );
};
enum osd_types {
  volume,
  brightness,
}
export default function OSD() {
  const SwitchOSD = Widget.Stack({
    children: {
      child1: Volume(),
      child_default: Widget.Label("Something went wrong!"),
    },
    shown: "child1",
  }).hook(audio.speaker, TriggerOSD(osd_types.volume), "notify::volume");

  let hideTimeoutId: number | null = null;

  function showOSDChild(type: osd_types): void {
    if (type === osd_types.volume) {
      SwitchOSD.shown = "child1";
    } else {
      SwitchOSD.shown = "child_default";
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
    child: SwitchOSD,
  });

  return window;
}
