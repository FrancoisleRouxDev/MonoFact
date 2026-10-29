import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

// ---------------------------------------------------------------------------
// Foreground handler
// ---------------------------------------------------------------------------
// SDK 58: `shouldShowAlert` is deprecated — notifications are shown as a
// banner and/or in the notification list instead.
// ---------------------------------------------------------------------------
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const DAILY_REMINDER_ID = "daily-reminder";
const DAILY_REMINDER_CHANNEL = "daily-reminder";
const REMINDER_HOUR = 18;
const REMINDER_MINUTE = 0;

// ---------------------------------------------------------------------------
// ensureExactAlarmPermission
// ---------------------------------------------------------------------------
// Android only. Checks whether the app may schedule exact alarms and, if not,
// asks the user. Returns whether the permission is granted — never throws, so
// a denial (or a missing SCHEDULE_EXACT_ALARM declaration) just means the
// reminder is scheduled without exact timing.
// ---------------------------------------------------------------------------
export async function ensureExactAlarmPermission(): Promise<boolean> {
    if (Platform.OS !== "android") return true;

    try {
        const current = await Notifications.getExactAlarmPermissionsAsync();
        if (current.granted) return true;

        const requested = await Notifications.requestExactAlarmPermissionsAsync();
        return requested.granted;
    } catch (error) {
        console.warn("Exact alarm permission unavailable:", error);
        return false;
    }
}

// ---------------------------------------------------------------------------
// scheduleDailyReminder
// ---------------------------------------------------------------------------
// Schedules (or replaces) a repeating daily reminder. Uses
// `delivery: 'bestEffort'`, which works with or without the exact alarm
// permission — without it Android may just deliver a little late.
// ---------------------------------------------------------------------------
export async function scheduleDailyReminder(): Promise<void> {
    if (Platform.OS === "web") return;

    const { granted } = await Notifications.requestPermissionsAsync();
    if (!granted) return;

    // Android needs a channel, but creating one can fail on some devices and in
    // Expo Go. That must not block the reminder, so fall back to the default channel.
    let channelId: string | undefined;
    if (Platform.OS === "android") {
        try {
            await Notifications.setNotificationChannelAsync(DAILY_REMINDER_CHANNEL, {
                name: "Daily reminder",
                importance: Notifications.AndroidImportance.DEFAULT,
            });
            channelId = DAILY_REMINDER_CHANNEL;
        } catch (error) {
            console.warn("Could not create notification channel, using default:", error);
        }
    }

    await Notifications.scheduleNotificationAsync({
        identifier: DAILY_REMINDER_ID,
        content: {
            title: "Fact or myth?",
            body: "Your daily challenge is waiting — keep your streak alive.",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: REMINDER_HOUR,
            minute: REMINDER_MINUTE,
            channelId,
            delivery: "bestEffort",
        },
    });
}

// ---------------------------------------------------------------------------
// cancelDailyReminder
// ---------------------------------------------------------------------------
export async function cancelDailyReminder(): Promise<void> {
    if (Platform.OS === "web") return;
    await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
}

// ---------------------------------------------------------------------------
// setupNotifications
// ---------------------------------------------------------------------------
// Called once on app start: resolves exact-alarm permission, then schedules
// the daily reminder (falling back gracefully if the permission is denied).
// ---------------------------------------------------------------------------
export async function setupNotifications(): Promise<void> {
    try {
        await ensureExactAlarmPermission();
        await scheduleDailyReminder();
    } catch (error) {
        console.error("Failed to set up notifications:", error);
    }
}
