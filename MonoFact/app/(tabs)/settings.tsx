import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

import BottomNav from "@/components/navigation/BottomNav";
import ScreenHeader from "@/components/layout/ScreenHeader";
import SettingsSection from "@/components/settings/SettingsSection";
import SettingsItem from "@/components/settings/SettingsItem";
import SettingsSwitch from "@/components/settings/SettingsSwitch";
import LogoutButton from "@/components/settings/LogoutButton";
import { Toast, useToast } from "@/components/ui/Toast";

import { UserRound, Bell, Shield, Info, Clock, ChevronRight } from "lucide-react-native";

import { auth } from "@/app/services/config";
import { signOut } from "firebase/auth";
import { useUser } from "@/app/context/UserContext";
import { useEffect, useState } from "react";
import {
  getNotificationTime,
  getNotificationsEnabled,
  NotificationTime,
  setNotificationTime,
  setNotificationsEnabled,
} from "@/lib/notifications";

const MINUTES = [0, 15, 30, 45];

function formatNotificationTime(time: NotificationTime): string {
  const period = time.hour >= 12 ? "PM" : "AM";
  const hour = time.hour % 12 || 12;
  return `${hour}:${String(time.minute).padStart(2, "0")} ${period}`;
}

function toPickerValues(time: NotificationTime) {
  return {
    hour: time.hour % 12 || 12,
    minute: time.minute - (time.minute % 15),
    period: time.hour >= 12 ? "PM" : "AM",
  };
}

export default function SettingsScreen() {
  // Pull user data from shared context instead of fetching Firebase directly
  const { userData } = useUser();
  const { toast, showToast, hideToast } = useToast();
  const [notifications, setNotifications] = useState(false);
  const [notificationTime, setNotificationTimeState] = useState<NotificationTime>({ hour: 19, minute: 0 });
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [pickerHour, setPickerHour] = useState(7);
  const [pickerMinute, setPickerMinute] = useState(0);
  const [pickerPeriod, setPickerPeriod] = useState("PM");

  // Load the saved reminder choice (the app turns it on at first launch once permission is granted)
  useEffect(() => {
    Promise.all([getNotificationsEnabled(), getNotificationTime()]).then(([enabled, time]) => {
      setNotifications(enabled);
      setNotificationTimeState(time);
    });
  }, []);

  const handleNotificationsChange = async (enabled: boolean) => {
    setNotifications(enabled);
    const result = await setNotificationsEnabled(enabled);
    setNotifications(result);
  };

  const openTimePicker = () => {
    const values = toPickerValues(notificationTime);
    setPickerHour(values.hour);
    setPickerMinute(values.minute);
    setPickerPeriod(values.period);
    setTimePickerVisible(true);
  };

  const saveNotificationTime = async () => {
    const hour = pickerHour % 12 + (pickerPeriod === "PM" ? 12 : 0);
    const nextTime = { hour, minute: pickerMinute };
    const previousTime = notificationTime;
    setNotificationTimeState(nextTime);
    setTimePickerVisible(false);

    if (!(await setNotificationTime(nextTime))) {
      setNotificationTimeState(previousTime);
      showToast("Could not save notification time.", "error");
    }
  };
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/auth/login");
    } catch (error) {
      showToast("Logout failed. Please try again.", "error");
      console.error("Logout failed:", error);
    }
  };

  if (!userData) return null;

  return (
    <SafeAreaView style={styles.container}>

      {/* Toast notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <ScreenHeader title="Settings" />

        {/* ACCOUNT */}
        <SettingsSection title="ACCOUNT">
          <SettingsItem
            title={userData.username ?? ""}
            subtitle={userData.email ?? ""}
            icon={UserRound}
            onPress={() => router.push("/settings/account")}
          />
        </SettingsSection>

        {/* PREFERENCES */}
        <SettingsSection title="PREFERENCES">
          <SettingsSwitch
            title="Notifications"
            icon={Bell}
            value={notifications}
            onValueChange={handleNotificationsChange}
          />
          {notifications && (
            <Pressable style={styles.timeItem} onPress={openTimePicker}>
              <View style={styles.timeLeft}>
                <View style={styles.smallIconContainer}>
                  <Clock size={20} color={Colors.primaryDark} />
                </View>
                <View>
                  <Text style={styles.timeTitle}>Reminder time</Text>
                  <Text style={styles.timeSubtitle}>{formatNotificationTime(notificationTime)}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </Pressable>
          )}
        </SettingsSection>

        {/* ABOUT */}
        <SettingsSection title="ABOUT">
          <SettingsItem
            title="About MonoFact"
            icon={Info}
            onPress={() => router.push("/settings/about")}
          />
          <SettingsItem
            title="Privacy Policy"
            icon={Shield}
            onPress={() => router.push("/settings/privacy")}
          />
        </SettingsSection>

        {/* LOGOUT */}
        <LogoutButton onPress={handleLogout} />

        <Text style={styles.version}>MonoFact v1.0.0</Text>

      </ScrollView>

      <BottomNav current="settings" />

      <Modal
        visible={timePickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reminder time</Text>
            <Text style={styles.modalSubtitle}>Choose when you want your daily challenge reminder.</Text>

            <View style={styles.pickerRow}>
              <ScrollView contentContainerStyle={styles.pickerOptions} showsVerticalScrollIndicator={false}>
                {Array.from({ length: 12 }, (_, index) => index + 1).map((hour) => (
                  <Pressable
                    key={hour}
                    style={[styles.pickerOption, pickerHour === hour && styles.selectedPickerOption]}
                    onPress={() => setPickerHour(hour)}
                  >
                    <Text style={[styles.pickerText, pickerHour === hour && styles.selectedPickerText]}>{hour}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <ScrollView contentContainerStyle={styles.pickerOptions} showsVerticalScrollIndicator={false}>
                {MINUTES.map((minute) => (
                  <Pressable
                    key={minute}
                    style={[styles.pickerOption, pickerMinute === minute && styles.selectedPickerOption]}
                    onPress={() => setPickerMinute(minute)}
                  >
                    <Text style={[styles.pickerText, pickerMinute === minute && styles.selectedPickerText]}>
                      {String(minute).padStart(2, "0")}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              <View style={styles.periodOptions}>
                {["AM", "PM"].map((period) => (
                  <Pressable
                    key={period}
                    style={[styles.pickerOption, pickerPeriod === period && styles.selectedPickerOption]}
                    onPress={() => setPickerPeriod(period)}
                  >
                    <Text style={[styles.pickerText, pickerPeriod === period && styles.selectedPickerText]}>{period}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <Pressable onPress={() => setTimePickerVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={saveNotificationTime} style={styles.saveButton}>
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 120,
  },

  version: {
    textAlign: "center",
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
  },
  timeItem: {
    minHeight: 64,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  timeTitle: {
    ...Typography.body,
    fontWeight: "500",
    color: Colors.text,
  },
  timeSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
  },
  modalTitle: {
    ...Typography.title,
    color: Colors.text,
  },
  modalSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  pickerRow: {
    height: 220,
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
    marginVertical: Spacing.lg,
  },
  pickerOptions: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  periodOptions: {
    gap: Spacing.xs,
  },
  pickerOption: {
    minWidth: 56,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
  },
  selectedPickerOption: {
    backgroundColor: Colors.primary,
  },
  pickerText: {
    ...Typography.body,
    color: Colors.text,
  },
  selectedPickerText: {
    color: Colors.surface,
    fontWeight: "700",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.md,
  },
  cancelButton: {
    padding: Spacing.md,
  },
  cancelText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  saveText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: "700",
  },
});