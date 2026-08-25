import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

import {
  Zap,
  Target,
  Gamepad2,
  FlaskConical,
} from "lucide-react-native";

import ProfileHeader from "@/components/newcomps/ProfileHeader";
import ProfileStatCard from "@/components/cards/ProfileStatCard";
import AchievementsCard from "@/components/cards/AchiementCard";
import BottomNav from "@/components/navigation/BottomNav";
import { Toast, useToast } from "@/components/ui/Toast";

import { useProfilePhoto } from "@/hooks/useProfilePhoto";
import { useUser } from "@/app/context/UserContext";
import { useState } from "react";

/**
 * ProfileScreen (file: app/(tabs)/profile.tsx)
 * Displays user identity, custom avatar with picker, XP progression,
 * 4 summary stat cards, and the 27 achievements breakdown.
 */
export default function ProfileScreen() {
  // Pull live user data from shared context
  const { userData } = useUser();

  // Track photoURL locally so avatar updates immediately after upload
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  const { toast, showToast, hideToast } = useToast();
  const { pickAndUpload, uploading } = useProfilePhoto(
    (url) => {
      setPhotoURL(url);
      showToast("Profile picture updated.", "success");
    },
    (message) => showToast(message, "error")
  );
  if (!userData) {
    return null;
  }

  // Active photo URL preferring local immediate state, then remote Firestore URL
  const activePhotoURL = photoURL ?? userData.photoURL ?? null;

  // -----------------------------
  // Accuracy
  // -----------------------------

  const totalAnswers =
    (userData.totalCorrect ?? 0) +
    (userData.totalIncorrect ?? 0);

  const accuracy =
    totalAnswers === 0
      ? 0
      : Math.round(
        ((userData.totalCorrect ?? 0) / totalAnswers) * 100
      );

  // -----------------------------
  // Profile statistics
  // -----------------------------

  const stats = [
    {
      icon: Zap,
      value: `${userData.xp ?? 0}`,
      label: "Total XP",
    },
    {
      icon: Target,
      value: `${accuracy}%`,
      label: "Accuracy",
    },
    {
      icon: Gamepad2,
      value: `${userData.gamesPlayed ?? 0}`,
      label: "Games Played",
    },
    {
      icon: FlaskConical,
      value: userData.favoriteCategory ?? "None",
      label: "Fav. Category",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <ProfileHeader
          username={userData.username ?? "User"}
          email={userData.email ?? ""}
          level={`Level ${userData.level ?? 1} • Fact Explorer`}
          photoURL={activePhotoURL}
          onPhotoPress={pickAndUpload}
          uploadingPhoto={uploading}
        />

        <View style={styles.statsContainer}>

          {stats.map((stat) => (
            <ProfileStatCard
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
            />
          ))}

        </View>

        <Toast
          message={toast.message}
          type={toast.type}
          visible={toast.visible}
          onHide={hideToast}
        />

        <AchievementsCard />

      </ScrollView>

      <BottomNav current="profile" />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",

    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
});