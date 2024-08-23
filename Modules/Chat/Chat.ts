// @ts-ignore
import Gtk from "gi://Gtk";
imports.gi.versions.WebKit2 = "4.0";
// @ts-ignore
import WebKit from "gi://WebKit2";
import { icons } from "assets/Assets";
import { fetchGroq } from "./GroqAPI";
import PopupWindow from "Widgets/PopupWindow";

const TextEntryWidget = Widget.subclass(Gtk.TextView);
const TextInputWidget = TextEntryWidget({
  // @ts-ignore
  wrap_mode: Gtk.WrapMode.WORD_CHAR,
  left_margin: 5,
  top_margin: 5,
  setup(self) {
    self.bind();
  },
});

// Wrap the TextInputWidget in a Scrollable
const ScrollableTextInputWidget = Widget.Scrollable({
  vscroll: "automatic",
  hscroll: "never",
  hexpand: true,
  class_name: "inputBox",
  child: TextInputWidget,
});

const chatHeader = Widget.CenterBox({
  class_name: "chatHeader",
  start_widget: Widget.Label(),
  center_widget: Widget.Label({
    label: "Chat",
  }),
  end_widget: Widget.Button({
    hexpand: false,
    hpack: "end",
    on_clicked: () => {
      App.ToggleWindow("Chat");
    },
    child: Widget.Icon({
      icon: icons.closeChatSvg,
      size: 25,
      hexpand: false,
    }),
  }),
});

const webView = new WebKit.WebView();
webView.load_uri(`${App.configPath}/Modules/Chat/index.html`);

const InputSection = Widget.Box({
  class_name: "chatInput",
  hexpand: true,
  spacing: 8,
  children: [
    ScrollableTextInputWidget,
    Widget.Button({
      hpack: "end",
      hexpand: false,
      vexpand: false,
      vpack: "center",
      class_name: "sendButton",
      on_primary_click_release: () => {
        CreateResultWebView();
      },
      child: Widget.Icon({
        hexpand: false,
        icon: icons.sendSvg,
        size: 20,
      }),
    }),
  ],
});

const chatView = Widget.Box({
  class_name: "chatView",
  vexpand: true,
  vertical: true,
  hpack: "fill",
  children: [webView],
});

export default () =>
  PopupWindow({
    name: "Chat",
    anchor: ["top", "left", "bottom"],
    transition_type: "slide_right",
    exclusivity: "normal",
    keymode: "on-demand",
    class_name: "chat",
    child: Widget.Box(
      {
        class_name: "chatBox",
        expand: true,
        vertical: true,
      },
      chatHeader,
      chatView,
      InputSection
    ),
  });

function CreateResultWebView() {
  let startIter = TextInputWidget.get_buffer().get_start_iter();
  let endIter = TextInputWidget.get_buffer().get_end_iter();
  let textToSend = TextInputWidget.get_buffer().get_text(
    startIter,
    endIter,
    true
  );

  fetchGroq(textToSend)
    .then((result) => {
      let resultText = Array.isArray(result) ? result.join(" ") : result;
      console.log("Result: ", resultText);
      let script = `
        const resultBox = document.createElement('div');
        resultBox.className = 'resultBox';
        resultBox.innerHTML = '<p>' + ${JSON.stringify(resultText)} + '</p>';
        document.getElementById('results').prepend(resultBox);
      `;
      webView.run_javascript(script);
    })
    .catch((error) => {
      console.error("Error fetching Groq API:", error);
    });
}
