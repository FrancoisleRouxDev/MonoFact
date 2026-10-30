import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

// SDK 58: `shouldShowAlert` is deprecated; notifications are shown as a
// banner and/or in the notification list instead.
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const STORAGE_KEY = "notificationsEnabled";
const REMINDER_ID = "daily-reminder";
const REMINDER_CHANNEL = "daily-reminder";
const REMINDER_HOUR = 19;
const REMINDER_MINUTE = 0;

async function requestPermission(): Promise<boolean> {
    if (Platform.OS === "web") return false;
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
}

// Schedules (or replaces) ONE repeating daily reminder at 19:00 local time.
// A daily reminder doesn't need exact timing, so no exact-alarm permission is
// requested.
async function scheduleDailyReminder(): Promise<void> {
    // Creating the Android channel can fail on some devices and in Expo Go.
    // That must not block the reminder, so fall back to the default channel.
    let channelId: string | undefined;
    if (Platform.OS === "android") {
        try {
            await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL, {
                name: "Daily reminder",
                importance: Notifications.AndroidImportance.DEFAULT,
            });
            channelId = REMINDER_CHANNEL;
        } catch (error) {
            console.warn("Could not create notification channel, using default:", error);
        }
    }

    await Notifications.scheduleNotificationAsync({
        identifier: REMINDER_ID,
        content: {
            title: "Fact or myth?",
            body: "Your daily challenge is ready",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: REMINDER_HOUR,
            minute: REMINDER_MINUTE,
            channelId,
        },
    });
}

async function cancelDailyReminder(): Promise<void> {
    if (Platform.OS === "web") return;
    await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);
}

async function readPreference(): Promise<boolean | null> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        return raw === null ? null : raw === "true";
    } catch {
        return null;
    }
}

async function writePreference(enabled: boolean): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, String(enabled));
    } catch (error) {
        console.warn("Failed to save notification preference:", error);
    }
}

export async function getNotificationsEnabled(): Promise<boolean> {
    return (await readPreference()) ?? false;
}

// Turns the daily reminder on or off and remembers the choice. Turning it on
// needs permission; returns the resulting state (false if permission was denied).
export async function setNotificationsEnabled(enabled: boolean): Promise<boolean> {
    try {
        if (enabled && (await requestPermission())) {
            await scheduleDailyReminder();
            await writePreference(true);
            return true;
        }
        await cancelDailyReminder();
        await writePreference(false);
        return false;
    } catch (error) {
        console.error("Failed to update notifications:", error);
        return false;
    }
}

// Called once on app start. First launch: on once the user grants permission.
// Afterwards the saved choice is respected and the reminder is re-scheduled.
export async function initNotifications(): Promise<void> {
    const saved = await readPreference();
    if (saved === false) return;
    await setNotificationsEnabled(true);
}
