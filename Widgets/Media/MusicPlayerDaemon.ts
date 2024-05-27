import Widget from "resource:///com/github/Aylur/ags/widget.js";
export const mpris = await Service.import("mpris");

/** @param {import('types/service/mpris').MprisPlayer} player */
export function Player(
  player: import("types/service/mpris").MprisPlayer
): import("/home/archkye/.dotfiles/dot-config/ags/types/widgets/button").Button<
  import("/home/archkye/.dotfiles/dot-config/ags/types/widgets/label").Label<unknown>,
  unknown
> {
  return Widget.Button({
    className: "media",
    on_primary_click_release: () => App.ToggleWindow("mpris"),
    on_secondary_click_release: () => player.playPause(),
    child: Widget.Label().hook(player, (label) => {
      const { track_title } = player;
      label.label = `${track_title}`;
    }),
  });
}

export const MusicPlayerDaemon = Widget.Box({
  children: mpris
    .bind("players")
    .as((p) => p.filter((player) => player.name === "mpd").map(Player)),
});
