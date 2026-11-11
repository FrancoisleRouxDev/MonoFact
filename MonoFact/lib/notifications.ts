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
const TIME_STORAGE_KEY = "notificationsTime";
const REMINDER_ID = "daily-reminder";
const REMINDER_CHANNEL = "daily-reminder";
const DEFAULT_NOTIFICATION_TIME: NotificationTime = { hour: 19, minute: 0 };

export type NotificationTime = {
    hour: number;
    minute: number;
};

async function requestPermission(): Promise<boolean> {
    if (Platform.OS === "web") return false;
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
}

// Schedules (or replaces) ONE repeating daily reminder at the user's local time.
// A daily reminder doesn't need exact timing, so no exact-alarm permission is
// requested.
async function scheduleDailyReminder(time: NotificationTime): Promise<void> {
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
            hour: time.hour,
            minute: time.minute,
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

function isValidNotificationTime(time: NotificationTime): boolean {
    return Number.isInteger(time.hour)
        && time.hour >= 0
        && time.hour <= 23
        && Number.isInteger(time.minute)
        && time.minute >= 0
        && time.minute <= 59;
}

async function readNotificationTime(): Promise<NotificationTime> {
    try {
        const raw = await AsyncStorage.getItem(TIME_STORAGE_KEY);
        if (!raw) return DEFAULT_NOTIFICATION_TIME;

        const parsed: unknown = JSON.parse(raw);
        if (
            typeof parsed === "object"
            && parsed !== null
            && "hour" in parsed
            && "minute" in parsed
            && typeof parsed.hour === "number"
            && typeof parsed.minute === "number"
        ) {
            const time = { hour: parsed.hour, minute: parsed.minute };
            if (isValidNotificationTime(time)) return time;
        }
    } catch (error) {
        console.warn("Failed to read notification time:", error);
    }

    return DEFAULT_NOTIFICATION_TIME;
}

async function writeNotificationTime(time: NotificationTime): Promise<void> {
    await AsyncStorage.setItem(TIME_STORAGE_KEY, JSON.stringify(time));
}

export async function getNotificationsEnabled(): Promise<boolean> {
    return (await readPreference()) ?? false;
}

export async function getNotificationTime(): Promise<NotificationTime> {
    return readNotificationTime();
}

export async function setNotificationTime(time: NotificationTime): Promise<boolean> {
    if (!isValidNotificationTime(time)) return false;

    try {
        await writeNotificationTime(time);
        if (await getNotificationsEnabled()) {
            await scheduleDailyReminder(time);
        }
        return true;
    } catch (error) {
        console.error("Failed to update notification time:", error);
        return false;
    }
}

// Turns the daily reminder on or off and remembers the choice. Turning it on
// needs permission; returns the resulting state (false if permission was denied).
export async function setNotificationsEnabled(enabled: boolean): Promise<boolean> {
    try {
        if (enabled && (await requestPermission())) {
            await scheduleDailyReminder(await readNotificationTime());
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
