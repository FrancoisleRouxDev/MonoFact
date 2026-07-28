import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

// Components
import StatCard from "@/components/cards/StatCard";
import BottomNav from "@/components/navigation/BottomNav";
import AccuracyCategoryCard from "@/components/cards/AccuracyCategoryCard";

// Icons
import { Trophy, Check, X, Target, Flame, FlaskConical } from "lucide-react-native";

//Stats data
const stats = [
  {
    icon: Trophy,
    title: "47",
    subtitle: "Total Games",
  },
  {
    icon: Check,
    title: "187",
    subtitle: "Correct Answers",
  },
  {
    icon: X,
    title: "48",
    subtitle: "Incorrect Answers",
  },
  {
    icon: Target,
    title: "79.6%",
    subtitle: "Accuracy",
  },
  {
    icon: Flame,
    title: "12",
    subtitle: "Best Streak",
  },
  {
    icon: FlaskConical,
    title: "Science",
    subtitle: "Fav. Category",
  },
];

export default function HomeScreen() {

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>

          <ScrollView showsVerticalScrollIndicator={false}>

              <Text style={styles.categoryTitle}>
                Statistics
              </Text>

              <Text style={styles.categorySubtitle}>
                Your performance at a glance
              </Text>

            <View style={styles.statsGrid}>
              {stats.map((stat) => (
                <StatCard
                  key={stat.subtitle}
                  icon={stat.icon}
                  title={stat.title}
                  subtitle={stat.subtitle}
                />
              ))}
            </View>

            <AccuracyCategoryCard />

          </ScrollView>

      <BottomNav current="stats" />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
  },
  header:{
    backgroundColor: "#8A8A8A",
    paddingHorizontal: 20,
    paddingTop: 20,
    height: 300,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

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
  categorySubtitle: {
    fontSize: 18,
    color: "black",
    paddingHorizontal: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  statsGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  paddingHorizontal: 20,
  marginTop: 20,
},

});