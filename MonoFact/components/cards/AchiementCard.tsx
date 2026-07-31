import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

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
    backgroundColor: "white",
    borderRadius: 28,
    padding: 20,
    marginHorizontal: 20,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  badge: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#EEF2FA",

    padding: 12,

    borderRadius: 14,
  },

  badgeText: {
    marginLeft: 8,
    color: "#555",
    fontWeight: "500",
  },
});