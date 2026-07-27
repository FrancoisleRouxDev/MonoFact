import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// Components
import StatCard from "@/components/newcomps/StatCard";
import ContinueCard from "@/components/newcomps/ContinueCard";
import CategoryCard from "@/components/newcomps/CategoryCard";
import DailyChallengeCard from "@/components/newcomps/DailyChallengeCard";
import BottomNav from "@/components/newcomps/BottomNav";
// import AchiementCard from "@/components/newcomps/AchiementCard";

// Icons
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

      </View>

      <View style={styles.dailyChallengeCard}>
        <DailyChallengeCard
          title="Daily Challenge"
          description="Complete today's fact challenge."
          reward="+250 XP"
          icon="trophy-outline"
          onPress={() => {}}
        />

      </View>

      <BottomNav current="profile" />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header:{
    backgroundColor: "#8A8A8A",
    paddingHorizontal: 20,
    paddingTop: 20,
    height: 300,
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
  },

  //body section
  categoryTitle: {
    fontSize: 30,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginLeft: 20,
    
  },
  categoryContainer1: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
    categoryContainer2: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  dailyChallengeCard: {

  }
});