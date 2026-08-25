import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
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

import { UserRound, Bell, Shield, Info } from "lucide-react-native";

import { auth } from "@/app/services/config";
import { signOut } from "firebase/auth";
import { useUser } from "@/app/context/UserContext";
import { useState } from "react";

export default function SettingsScreen() {
  // Pull user data from shared context instead of fetching Firebase directly
  const { userData } = useUser();
  const { toast, showToast, hideToast } = useToast();
  const [notifications, setNotifications] = useState(true);
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
            onValueChange={setNotifications}
          />
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
});