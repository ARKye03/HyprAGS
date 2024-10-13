import { Globals } from "Modules/userVars";
import PopupWindow from "Widgets/PopupWindow";
import { icons } from "assets/Assets";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";

const network = await Service.import("network");
const Notification = await Service.import("notifications");
Notification.clearDelay = 25;
const UpperBox = Widget.CenterBox({
	class_name: "side_dash_title",
	start_widget: Widget.Box({
		class_name: "side_dash_title_start",
		children: [
			Widget.Button({
				class_name: "side_dash_sys_button",
				hpack: "start",
				child: Widget.Icon({
					class_name: "side_dash_sys_button_toggleVPN",
					icon: network.vpn
						.bind("activated_connections")
						.as((state) =>
							state.some((connection) => connection.state === "connected")
								? icons.ToggleVPN_on
								: icons.ToggleVPN_off,
						),
					size: 25,
					hpack: "start",
					hexpand: false,
				}),
				on_primary_click_release: () =>
					execAsync(`${Globals.HOME}/.dotfiles/scripts/toggle_vpn.lua`),
			}),
			Widget.Button({
				class_name: "side_dash_sys_button",
				hpack: "start",
				visible: Globals.DESKTOP_SESSION === "hyprland" ? true : false,
				child: Widget.Icon({
					icon: icons.WorkLogo,
					size: 20,
					hpack: "start",
					hexpand: false,
				}),
				on_primary_click_release: () =>
					execAsync("hyprctl dispatch togglespecialworkspace"),
			}),
		],
	}),
	center_widget: Widget.Label({
		hpack: "fill",
		hexpand: true,
		label: `Hello ${Globals.CurrentUser}!`,
	}),
	end_widget: Widget.Button({
		class_name: "side_dash_sys_button",
		hpack: "end",
		hexpand: false,
		child: Widget.Icon({
			icon: icons.PowerButton,
			class_name: "sdsb",
			size: 25,
			hpack: "end",
			hexpand: false,
		}),
		on_primary_click_release: () => {
			App.ToggleWindow("powermenu");
		},
	}),
});

function createNotificationWidget(notification: {
	urgency: any;
	summary: any;
	body: any;
	dismiss: () => unknown;
}) {
	return Widget.Box({
		class_name: `notification_side_box-${notification.urgency}`,
		vertical: true,
		children: [
			Widget.Label({
				class_name: `notification-title-${notification.urgency}`,
				justification: "center",
				truncate: "end",
				use_markup: true,
				wrap: true,
				label: notification.summary,
			}),
			Widget.Label({
				class_name: "notification-body",
				truncate: "end",
				justification: "center",
				use_markup: true,
				wrap: true,
				label: notification.body,
				max_width_chars: 20,
			}),
			// Widget.Button({
			//   hpack: "end",
			//   hexpand: true,
			//   on_primary_click_release: () => notification.dismiss(),
			//   child: Widget.Icon({
			//     icon: icons.closeChatSvg,
			//     size: 20,
			//   }),
			// }),
		],
	});
}

const Notifications = Widget.Scrollable({
	class_name: "side_dash_notifications_scroll",
	child: Widget.Box({
		vertical: true,
		spacing: 10,
		children: Notification.bind("notifications").as((notifications) =>
			notifications.map(createNotificationWidget),
		),
	}),
});

const NotificationsBox = Widget.Box({
	class_name: "side_dash_notifications",
	vertical: true,
	spacing: 10,
	children: [
		Widget.CenterBox({
			class_name: "side_dash_notifications_title",
			start_widget: Widget.Box(),
			center_widget: Widget.Label({
				hpack: "center",
				hexpand: true,
				label: Notification.bind("notifications").as(
					(n) => `There are ${n.length} notifications`,
				),
			}),
			end_widget: Widget.Button({
				hpack: "end",
				on_primary_click_release: () => Notification.clear(),
				child: Widget.Icon({
					icon: icons.trashNotificationsSvg,
					size: 20,
				}),
			}),
		}),
		Notifications,
	],
});

const Calendar = Widget.Calendar({
	class_name: "side_dash_calendar",
});

const SideDashBox = Widget.Box(
	{
		class_name: "side_dash_box",
		expand: true,
		vertical: true,
		spacing: 5,
	},
	UpperBox,
	Calendar,
	NotificationsBox,
);

export default () =>
	PopupWindow({
		name: "SideDash",
		anchor: ["top", "right", "bottom"],
		class_name: "side_dash",
		transition_type: "slide_left",
		child: SideDashBox,
	});
