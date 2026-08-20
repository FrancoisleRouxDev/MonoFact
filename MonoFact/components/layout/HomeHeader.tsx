import { View, Text, StyleSheet } from "react-native";
import { Zap, Flame, Target } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

import HeaderStatCard from "../cards/HeaderStatCard";
import { useUser } from "@/app/context/UserContext";

// ---------------------------------------------------------------------------
// getGreeting
// ---------------------------------------------------------------------------
// Returns a time-appropriate greeting based on the current hour.
//   0–11  → Good morning
//   12–17 → Good afternoon
//   18–23 → Good evening
// ---------------------------------------------------------------------------
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 18) return "Good afternoon,";
  return "Good evening,";
}

// ---------------------------------------------------------------------------
// HomeHeader
// ---------------------------------------------------------------------------
// Displays a personalised greeting + three quick-stat cards (XP, Streak,
// Accuracy) at the top of the Home screen. Reads from shared UserContext
// instead of fetching Firestore directly — no duplicate network calls.
// ---------------------------------------------------------------------------
export default function HomeHeader() {

  // Pull user data from shared context instead of fetching Firebase directly
  const { userData } = useUser();

  // Render nothing until user data has loaded to avoid a flash of broken UI.
  if (!userData) return null;

  // Calculate accuracy from stored correct/incorrect counts.
  const totalAnswers =
    (userData.totalCorrect ?? 0) + (userData.totalIncorrect ?? 0);

  const accuracy =
    totalAnswers === 0
      ? "0%"
      : `${Math.round(
        ((userData.totalCorrect ?? 0) / totalAnswers) * 100
      )}%`;

  // Stats shown as pill cards in the header banner.
  const stats = [
    {
      icon: Zap,
      value: (userData.xp ?? 0).toString(),
      label: "XP",
    },
    {
      icon: Flame,
      // currentStreak is stored as a number — show "0d" if undefined.
      value: `${userData.currentStreak ?? 0}d`,
      label: "Streak",
    },
    {
      icon: Target,
      value: accuracy,
      label: "Accuracy",
    },
  ];

  return (
    <View style={styles.container}>

      {/* Time-aware greeting line */}
      <Text style={styles.greeting}>
        {getGreeting()}
      </Text>

      {/* Username — capitalise first letter for display */}
      <Text style={styles.username}>
        {(userData.username ?? "there").charAt(0).toUpperCase() +
          (userData.username ?? "there").slice(1)}
      </Text>

      {/* Quick-stat row */}
      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <HeaderStatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: 36,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  greeting: {
    ...Typography.caption,
    color: "rgba(255, 255, 255, 0.72)",
  },

  username: {
    ...Typography.h1,
    color: Colors.surface,
    marginTop: 2,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
});