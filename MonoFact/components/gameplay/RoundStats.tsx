import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

// ---------------------------------------------------------------------------
// RoundStatsProps
// ---------------------------------------------------------------------------
// level      — the player's current level number
// currentXP  — how much total XP they have right now
// requiredXP — the XP needed to reach the next level
// ---------------------------------------------------------------------------
type RoundStatsProps = {
  level: number;
  currentXP: number;
  requiredXP: number;
};

// ---------------------------------------------------------------------------
// RoundStats
// ---------------------------------------------------------------------------
// Shown on the Results screen after completing a round.
// Displays the XP progress bar from the current level to the next level.
// The bar fills proportionally: currentXP / requiredXP × 100%.
// ---------------------------------------------------------------------------
export default function RoundStats({
  level,
  currentXP,
  requiredXP,
}: RoundStatsProps) {
  // Clamp to 100% in case XP slightly exceeds requiredXP before level-up syncs.
  const percentage = Math.min(100, (currentXP / requiredXP) * 100);

  return (
    <View style={styles.card}>

      {/* Level label on the left, XP fraction on the right */}
      <View style={styles.row}>
        <Text style={styles.level}>
          Level {level} → Level {level + 1}
        </Text>

        <Text style={styles.points}>
          {currentXP} / {requiredXP} XP
        </Text>
      </View>

      {/* Progress bar — fills left to right based on XP percentage */}
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${percentage}%` },
          ]}
        />
      </View>

      {/* XP remaining until level-up */}
      <Text style={styles.remaining}>
        {Math.max(0, requiredXP - currentXP)} XP until next level!
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },

  level: {
    ...Typography.caption,
    fontWeight: "700",
    color: Colors.text,
  },

  points: {
    ...Typography.small,
    fontWeight: "600",
    color: Colors.textSecondary,
  },

  barBackground: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 20,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },

  remaining: {
    marginTop: Spacing.sm,
    ...Typography.small,
    color: Colors.textSecondary,
  },
});