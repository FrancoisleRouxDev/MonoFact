import { View, Text, StyleSheet } from "react-native";
import { Zap, Flame, Target, LucideIcon } from "lucide-react-native";

import HeaderStatCard from "../cards/HeaderStatCard";

export default function HomeHeader() {

  const username = "John Doe";

  const stats: {
    icon: LucideIcon;
    value: string;
    label: string;
  }[] = [
    {
      icon: Zap,
      value: "4,820",
      label: "XP",
    },
    {
      icon: Flame,
      value: "12d",
      label: "Streak",
    },
    {
      icon: Target,
      value: "84%",
      label: "Accuracy",
    },
  ];

  return (
    <View style={styles.container}>

      <Text style={styles.greeting}>
        Good Morning
      </Text>

      <Text style={styles.username}>
        {username}
      </Text>

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
    backgroundColor: "#8A8A8A",

    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,

    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  greeting: {
    color: "white",
    fontSize: 18,
  },

  username: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",

    marginTop: 8,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginTop: 30,
  },
});