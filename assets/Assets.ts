const getSvgPath = (filePath: string) => `${App.configDir}/assets/${filePath}`;
const getImagePath = (filePath: string) =>
  `${App.configDir}/assets/Wallpapers/${filePath}`;
const getSoundPath = (filePath: string) =>
  `${App.configDir}/assets/Sounds/${filePath}`;

export const icons = {
  PowerButton: getSvgPath("SideDashboard/powerButton.svg"),
  ArchLogo: getSvgPath("archLogo.svg"),
  Clipboard: getSvgPath("clipboard.svg"),
  AppLauncher: getSvgPath("applauncher.svg"),
  WorkLogo: getSvgPath("work.svg"),
  moodSad: getSvgPath("moodSad.svg"),
  lowPop: getSvgPath("NotisPops/lowPop.svg"),
  normalPop: getSvgPath("NotisPops/normalPop.svg"),
  criticalPop: getSvgPath("NotisPops/criticalPop.svg"),
  ToggleVPN_on: getSvgPath("SideDashboard/pvpn_on.svg"),
  ToggleVPN_off: getSvgPath("SideDashboard/pvpn_off.svg"),
  SysLock: getSvgPath("SideDashboard/SysButtons/lock.svg"),
  SysLogout: getSvgPath("SideDashboard/SysButtons/logout.svg"),
  SysOff: getSvgPath("SideDashboard/SysButtons/off.svg"),
  SysReboot: getSvgPath("SideDashboard/SysButtons/reboot.svg"),
  SysSuspend: getSvgPath("SideDashboard/SysButtons/suspend.svg"),
  Pacman: getSvgPath("pacman.svg"),
  playSvg: getSvgPath("MediaWidget/Play.svg"),
  stopSvg: getSvgPath("MediaWidget/Stop.svg"),
  singleSvg: getSvgPath("MediaWidget/Single.svg"),
  nextSvg: getSvgPath("MediaWidget/Next.svg"),
  repeatSvg: getSvgPath("MediaWidget/Repeat.svg"),
  prevSvg: getSvgPath("MediaWidget/Prev.svg"),
  openPlayerSvg: getSvgPath("MediaWidget/OpenPlayer.svg"),
  trashNotificationsSvg: getSvgPath("TrashNotifications.svg"),
  sendSvg: getSvgPath("send.svg"),
  notificationSvg: getSvgPath("notification.svg"),
  closeChatSvg: getSvgPath("closeChat.svg"),
  pacmanSvg: getSvgPath("pacman.svg"),
};

export const wallpapers = {
  archBlack: getImagePath("archBlack.png"),
  oneDarkArch: getImagePath("oneDarkArch.png"),
};

export const sounds = {
  notificationLongPop: getSoundPath("notification-long-pop.opus"),
};
