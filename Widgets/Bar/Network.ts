
const network = await Service.import("network");

const WifiIndicator = () => Widget.Box({
    spacing: 10,
    class_name: "wifi_indicator",
},
    Widget.Icon({
        icon: network.wifi.bind('icon_name'),
    }),
    Widget.Label({
        label: network.wifi.bind('ssid')
            .as(ssid => ssid || 'Unknown'),
    }),
)
const WiredIndicator = () => Widget.Icon({
    class_name: "clock",
    icon: network.wired.bind('icon_name'),
})

export const NetworkIndicator = () => Widget.Stack({
    children: {
        wifi: WifiIndicator(),
        wired: WiredIndicator(),
    },
    shown: network.bind('primary').as(p => p || 'wifi'),
})