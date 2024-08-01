import applauncher from "Modules/AppLauncher/AppLauncher";
import Bar from "Modules/Bar/Bar";
import Chat from "Modules/Chat/Chat";
import App from "resource:///com/github/Aylur/ags/app.js";
import notificationPopup from "./Modules/Notifications/NotificationPops";
import SideDash from "Modules/SideDashBoard/master";
import MediaWidget from "Modules/Media/Mpris";
import VolumeOSD from "Modules/Media/osd";
import PowerMenu from "Modules/PowerMenu/PowerMenu";
import { Dock } from "Modules/Dock/dock";

// main scss file
const scss = `${App.configDir}/styles/MainStyle.scss`;

// target css file
const css = "/tmp/my-style.css";

Utils.monitorFile(
  // directory that contains the scss files
  `${App.configDir}/styles/`,

  // reload function
  () => {
    // main scss file
    const scss = `${App.configDir}/styles/MainStyle.scss`;

    // target css file
    const css = "/tmp/my-style.css";

    // compile, reset, apply
    Utils.exec(`sassc ${scss} ${css}`);
    App.resetCss();
    App.applyCss(css);
  }
);

// make sure sassc is installed on your system
Utils.exec(`sassc ${scss} ${css}`);

App.config({
  style: css,
  windows: [
    Bar(),
    notificationPopup,
    Chat(),
    MediaWidget,
    applauncher,
    SideDash(),
    VolumeOSD(),
    PowerMenu,
    Dock(),
    // await ClipboardManager(),
  ],
});
