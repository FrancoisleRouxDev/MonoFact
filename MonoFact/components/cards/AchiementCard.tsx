import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

import {
  Flame,
  Trophy,
  Rocket,
  Globe,
} from "lucide-react-native";

export default function AchievementsCard() {
  return (
    <View style={styles.container}>

      <Text style={styles.heading}>
        Achievements
      </Text>

      <View style={styles.row}>

        <View style={styles.badge}>
          <Flame size={18} />
          <Text style={styles.badgeText}>
            7-Day Streak
          </Text>
        </View>

        <View style={styles.badge}>
          <Trophy size={18} />
          <Text style={styles.badgeText}>
            Perfect Score
          </Text>
        </View>

      </View>

      <View style={styles.row}>

        <View style={styles.badge}>
          <Rocket size={18} />
          <Text style={styles.badgeText}>
            Speed Demon
          </Text>
        </View>

        <View style={styles.badge}>
          <Globe size={18} />
          <Text style={styles.badgeText}>
            Explorer
          </Text>
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,

    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 5,
  },

  heading: {
    ...Typography.h3,
    color: Colors.primaryDark,
    marginBottom: Spacing.lg,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },

  badge: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: Colors.surfaceLight,

    padding: Spacing.sm,

    borderRadius: 14,
  },

  badgeText: {
    marginLeft: Spacing.xs,
    ...Typography.caption,
    color: Colors.text,
    fontWeight: "500",
  },
});