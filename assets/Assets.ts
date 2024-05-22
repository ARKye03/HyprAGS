const getSvgPath = (filePath: string) => `${App.configDir}/assets/${filePath}`;

export const icons = {
  PowerButton: getSvgPath("SideDashboard/powerButton.svg"),
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
