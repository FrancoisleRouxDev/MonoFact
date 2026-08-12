import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

import StatCard from "@/components/cards/StatCard";
import BottomNav from "@/components/navigation/BottomNav";
import AccuracyCategoryCard from "@/components/cards/AccuracyCategoryCard";

import { Trophy, Check, X, Target, Flame, FlaskConical } from "lucide-react-native";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/services/config";
import { doc, getDoc } from "firebase/firestore";

export default function StatsScreen() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      const snapshot = await getDoc(doc(db, "users", currentUser.uid));

      if (snapshot.exists()) {
        setUserData(snapshot.data());
      }
    };

    loadUser();
  }, []);

  if (!userData) return null;

  // Safely default fields to 0 or fallback strings if undefined in Firestore
  const gamesPlayed = userData.gamesPlayed ?? 0;
  const totalCorrect = userData.totalCorrect ?? 0;
  const totalIncorrect = userData.totalIncorrect ?? 0;
  const bestStreak = userData.bestStreak ?? 0;
  const favoriteCategory = userData.favoriteCategory ?? "N/A";

  const totalAnswers = totalCorrect + totalIncorrect;

  const accuracy =
    totalAnswers === 0
      ? "0%"
      : `${Math.round((totalCorrect / totalAnswers) * 100)}%`;

  const stats = [
    {
      icon: Trophy,
      title: gamesPlayed.toString(),
      subtitle: "Total Games",
      iconBackgroundColor: "#EEF2FA",
    },
    {
      icon: Check,
      title: totalCorrect.toString(),
      subtitle: "Correct Answers",
      iconBackgroundColor: "#E4F7F4",
    },
    {
      icon: X,
      title: totalIncorrect.toString(),
      subtitle: "Incorrect Answers",
      iconBackgroundColor: "#FDEEEF",
    },
    {
      icon: Target,
      title: accuracy,
      subtitle: "Accuracy",
      iconBackgroundColor: "#E6F2FA",
    },
    {
      icon: Flame,
      title: bestStreak.toString(),
      subtitle: "Best Streak",
      iconBackgroundColor: "#FFF3DE",
    },
    {
      icon: FlaskConical,
      title: favoriteCategory,
      subtitle: "Fav. Category",
      iconBackgroundColor: "#EAE6FF",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.categoryTitle}>Statistics</Text>
          <Text style={styles.categorySubtitle}>
            Your performance at a glance
          </Text>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <StatCard
              key={stat.subtitle}
              icon={stat.icon}
              title={stat.title}
              subtitle={stat.subtitle}
              iconBackgroundColor={stat.iconBackgroundColor}
            />
          ))}
        </View>

        <AccuracyCategoryCard data={userData.categoryStats} />
      </ScrollView>

      <BottomNav current="stats" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 120,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  categoryTitle: {
    ...Typography.h2,
    color: Colors.primaryDark,
  },
  categorySubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
});