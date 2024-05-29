import { applauncher } from "Widgets/AppLauncher/AppLauncher";
import { Bar } from "Widgets/Bar/Bar";
import { Chat } from "Widgets/Chat/Chat";
import App from "resource:///com/github/Aylur/ags/app.js";
import { notificationPopup } from "./Widgets/Notifications/NotificationPops";
import { SideDash } from "Widgets/SideDashBoard/master";
import { MediaWidget } from "Widgets/Media/Mpris";
import { VolumeOSD } from "Widgets/Media/osd";
// import { ClipboardManager } from "Widgets/Clipboard/cliphist";

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
    // await ClipboardManager(),
  ],
});
