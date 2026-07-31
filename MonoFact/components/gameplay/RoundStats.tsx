import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

type RoundStatsProps = {
  level: number;
  currentXP: number;
  requiredXP: number;
};

export default function RoundStats({
    level,
    currentXP,
    requiredXP,
}:RoundStatsProps){

  const percentage =
    (currentXP / requiredXP) * 100;

  return (
    <View style={styles.card}>

      <View style={styles.row}>
        <Text style={styles.level}>
          Level 7 → Level 8
        </Text>

        <Text style={styles.points}>
          {currentXP} / {requiredXP} XP
        </Text>
      </View>

      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${percentage}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.remaining}>
        {requiredXP - currentXP} XP until next level!
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  level: {
    fontWeight: "700",
    fontSize: 16,
    color: "#444",
  },

  points: {
    color: "#99A2B0",
    fontWeight: "600",
  },

  barBackground: {
    height: 8,
    backgroundColor: "#E9EDF5",
    borderRadius: 20,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: "#8D939D",
    borderRadius: 20,
  },

  remaining: {
    marginTop: 10,
    color: "#99A2B0",
    fontSize: 14,
  },
});