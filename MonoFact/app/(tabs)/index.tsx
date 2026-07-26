import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// Components
import StatCard from "@/components/StatCard";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {

  const router = useRouter();

  //Temp username
  const username = "John Doe";

  //Mock Data
const stats: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}[] = [
  {
    icon: "flash-outline",
    value: "4,820",
    label: "XP",
  },
  {
    icon: "flame-outline",
    value: "12d",
    label: "Streak",
  },
  {
    icon: "stats-chart-outline",
    value: "84%",
    label: "Accuracy",
  },
];


  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.subtitle}>
          Good Morning
        </Text>

        <Text style={styles.title}>
          {username}
        </Text>

      <View style={styles.statsContainer}>
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </View>
        
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8A8A8A",
  },
  header:{
    paddingHorizontal: 20,
    paddingTop: 20,

  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  }
});