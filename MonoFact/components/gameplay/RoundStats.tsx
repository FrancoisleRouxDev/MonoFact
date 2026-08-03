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
          Level {level} → Level {level = 1}
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
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  level: {
    fontWeight: "700",
    fontSize: 15,
    color: "#444",
  },

  points: {
    fontSize: 13,
    color: "#99A2B0",
    fontWeight: "600",
  },

  barBackground: {
    height: 6,
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
    marginTop: 8,
    fontSize: 13,
    color: "#99A2B0",
  },
});