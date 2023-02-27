/// <reference types="@capacitor/push-notifications" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: "com.hour4u.app",
    appName: "Hour4U",
    webDir: "www",
    bundledWebRuntime: false,
    plugins: {
        PushNotifications: {
            presentationOptions: ["badge", "sound", "alert"],
        },
        LocalNotifications: {
            smallIcon: "icon.png",
            iconColor: "#488AFF",
            sound: "beep.wav",
        },
    },
};

export default config;