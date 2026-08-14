import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

import BottomNav from "@/components/navigation/BottomNav";
import ScreenHeader from "@/components/layout/ScreenHeader";

import SettingsSection from "@/components/settings/SettingsSection";
import SettingsItem from "@/components/settings/SettingsItem";
import SettingsSwitch from "@/components/settings/SettingsSwitch";
import LogoutButton from "@/components/settings/LogoutButton";

import {
  UserRound,
  Bell,
  Shield,
  Info,
} from "lucide-react-native";

import { auth, db } from "@/app/services/config";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";


export default function SettingsScreen() {

  const [notifications, setNotifications] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const router = useRouter();


  useEffect(() => {

    const loadUser = async () => {

      const currentUser = auth.currentUser;

      if (!currentUser) return;

      const snapshot = await getDoc(
        doc(db, "users", currentUser.uid)
      );

      if (snapshot.exists()) {
        setUserData(snapshot.data());
      }

    };

    loadUser();

  }, []);


  const handleLogout = async () => {

    try {

      await signOut(auth);

      router.replace("/auth/login");

    } catch (error) {

      console.error("Logout failed:", error);

    }

  };


  if (!userData) return null;


  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <ScreenHeader
          title="Settings"
        />


        {/* ACCOUNT */}

        <SettingsSection title="ACCOUNT">

          <SettingsItem
            title={userData.username}
            subtitle={userData.email}
            icon={UserRound}
            onPress={() => {}}
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
            onPress={() => {}}
          />

          <SettingsItem
            title="Privacy Policy"
            icon={Shield}
            onPress={() => {}}
          />

        </SettingsSection>


        {/* LOGOUT */}

        <LogoutButton
          onPress={handleLogout}
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