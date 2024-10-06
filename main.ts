import applauncher from "Modules/AppLauncher/AppLauncher";
import Bar from "Modules/Bar/Bar";
import Chat from "Modules/Chat/Chat";
import App from "resource:///com/github/Aylur/ags/app.js";
import notificationPopup from "./Modules/Notifications/NotificationPops";
import SideDash from "Modules/SideDashBoard/master";
import MediaWidget from "Modules/Media/Mpris";
import OSD from "Modules/OSD/master";
import PowerMenu from "Modules/PowerMenu/PowerMenu";

const SCSS_SOURCE = `${App.configDir}/styles/MainStyle.scss`;
const CSS_OUTPUT = "/tmp/ags.css";
const SCSS_COMPILER = "sass";
const CMD = `${SCSS_COMPILER} ${SCSS_SOURCE} ${CSS_OUTPUT}`;

Utils.monitorFile(
  `${App.configDir}/styles/`,

  () => {
    Utils.exec(CMD);
    App.resetCss();
    App.applyCss(CSS_OUTPUT);
  }
);

Utils.exec(CMD);

App.config({
  style: CSS_OUTPUT,
  windows: [
    Bar(),
    notificationPopup,
    Chat(),
    MediaWidget,
    applauncher,
    SideDash(),
    OSD(),
    PowerMenu,
  ],
});
