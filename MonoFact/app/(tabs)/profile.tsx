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

import { useProfilePhoto } from "@/hooks/useProfilePhoto";
import { useUser } from "@/app/context/UserContext";
import { useState } from "react";

export default function ProfileScreen() {

  // Pull user data from shared context instead of fetching Firebase directly
  const { userData } = useUser();

  // ---- track photoURL locally so avatar updates immediately after upload ----
  const [photoURL, setPhotoURL] = useState<string | null>(
    userData?.photoURL ?? null
  );

  const { pickAndUpload, uploading } = useProfilePhoto((url) => setPhotoURL(url));
  // ---------------------------------------------------------------------------

  if (!userData) {
    return null;
  }

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
          photoURL={photoURL}
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