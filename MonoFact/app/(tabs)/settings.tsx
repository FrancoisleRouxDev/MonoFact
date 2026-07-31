import { SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Colors } from "@/constants/Colors";


import BottomNav from "@/components/navigation/BottomNav";

import ScreenHeader from "@/components/layout/ScreenHeader";

import SettingsSection from "@/components/settings/SettingsSection";
import SettingsItem from "@/components/settings/SettingsItem";
import SettingsSwitch from "@/components/settings/SettingsSwitch";
import LogoutButton from "@/components/settings/LogoutButton";

import { UserRound, Bell, Shield, Info, } from "lucide-react-native";

export default function SettingsScreen() {

  const [notifications, setNotifications] = useState(true);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <ScreenHeader
          title="Settings"
        />

        <SettingsSection title="ACCOUNT">

          <SettingsItem
            title="Alex Rivera"
            subtitle="alex@email.com"
            icon={UserRound}
            onPress={() => {}}
          />

        </SettingsSection>

        <SettingsSection title="PREFERENCES">

          <SettingsSwitch
            title="Notifications"
            icon={Bell}
            value={notifications}
            onValueChange={setNotifications}
          />

        </SettingsSection>

        <SettingsSection title="ABOUT">

          <SettingsItem
            title="About MonoFact"
            icon={Info}
            onPress={() => {}}
          />

          <SettingsItem
            title="Privacy Policy"
            icon={Shield}
            onPress={() => {}}
          />

        </SettingsSection>

        <LogoutButton
        onPress={() => router.push("/auth/login")}
        />

        <Text style={styles.version}>
          MonoFact v1.0.0
        </Text>

      </ScrollView>

      <BottomNav current="settings" />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  version: {
    textAlign: "center",
    marginTop: 20,
    color: "#C6CAD6",
  },
});