import { Label } from "resource:///com/github/Aylur/ags/widgets/label.js";
import PopupWindow from "Widgets/PopupWindow";
const mpris = await Service.import("mpris");
const players = mpris.bind("players");

const FALLBACK_ICON = "audio-x-generic-symbolic";
const PLAY_ICON = "media-playback-start-symbolic";
const PAUSE_ICON = "media-playback-pause-symbolic";
const PREV_ICON = "media-skip-backward-symbolic";
const NEXT_ICON = "media-skip-forward-symbolic";

/** @param {number} length */
function lengthStr(length: number): string {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? "0" : "";
  return `${min}:${sec0}${sec}`;
}

/** @param {import('types/service/mpris').MprisPlayer} player */
function Player(player: import("types/service/mpris").MprisPlayer) {
  const img = Widget.Box({
    class_name: "img",
    vpack: "start",
    css: player.bind("cover_path").transform(
      (p) => `
            background-image: url('${p}');
        `
    ),
  });

  const title = Widget.Label({
    class_name: "title",
    wrap: true,
    truncate: "end",
    hpack: "start",
    label: player.bind("track_title"),
  });

  const artist = Widget.Label({
    class_name: "artist",
    wrap: true,
    truncate: "end",
    hpack: "start",
    label: player.bind("track_artists").transform((a) => a.join(", ")),
  });

  const positionSlider = Widget.Slider({
    class_name: "position",
    draw_value: false,
    on_change: ({ value }) => (player.position = value * player.length),
    visible: player.bind("length").as((l): boolean => l > 0),
    setup: (self) => {
      function update() {
        const value = player.position / player.length;
        self.value = value > 0 ? value : 0;
      }
      self.hook(player, update);
      self.hook(player, update, "position");
      self.poll(1000, update);
    },
  });

  const positionLabel = Widget.Label({
    class_name: "position",
    hpack: "start",
    setup: (self) => {
      const update = (_: Label<unknown>, time: number) => {
        self.label = lengthStr(time || player.position);
        self.visible = player.length > 0;
      };

      self.hook(player, update, "position");
      self.poll(1000, (self) => update(self, player.position));
    },
  });

  const lengthLabel = Widget.Label({
    class_name: "length",
    hpack: "end",
    visible: player.bind("length").transform((l) => l > 0),
    label: player.bind("length").transform(lengthStr),
  });

  const icon = Widget.Icon({
    class_name: "icon",
    hexpand: true,
    hpack: "end",
    vpack: "start",
    tooltip_text: player.identity || "",
    icon: player.bind("entry").transform((entry) => {
      const name = `${entry}-symbolic`;
      return Utils.lookUpIcon(name) ? name : FALLBACK_ICON;
    }),
  });

  const playPause = Widget.Button({
    class_name: "play-pause",
    on_clicked: () => player.playPause(),
    visible: player.bind("can_play"),
    child: Widget.Icon({
      icon: player.bind("play_back_status").transform((s) => {
        switch (s) {
          case "Playing":
            return PAUSE_ICON;
          case "Paused":
          case "Stopped":
            return PLAY_ICON;
        }
      }),
    }),
  });

  const prev = Widget.Button({
    on_clicked: () => player.previous(),
    visible: player.bind("can_go_prev"),
    child: Widget.Icon(PREV_ICON),
  });

  const next = Widget.Button({
    on_clicked: () => player.next(),
    visible: player.bind("can_go_next"),
    child: Widget.Icon(NEXT_ICON),
  });

  return Widget.Box(
    { class_name: "player" },
    img,
    Widget.Box(
      {
        vertical: true,
        hexpand: true,
        spacing: 10,
      },
      Widget.Box([title, icon]),
      artist,
      Widget.Box({ vexpand: true }),
      positionSlider,
      Widget.CenterBox({
        start_widget: positionLabel,
        center_widget: Widget.Box([prev, playPause, next]),
        end_widget: lengthLabel,
      })
    )
  );
}

const MprisBox = Widget.Box({
  vertical: true,
  visible: players.as((p) => p.some((player) => player.name === "mpd")),
  children: players.as((p) =>
    p.filter((player) => player.name === "mpd").map(Player)
  ),
});
export default PopupWindow({
  name: "mpris",
  anchor: ["top"],
  transition_type: "slide_down",
  child: MprisBox,
});
