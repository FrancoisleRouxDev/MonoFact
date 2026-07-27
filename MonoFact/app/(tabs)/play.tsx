import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// Components
import CategoryCard from "@/components/cards/CategoryCard";
import BottomNav from "@/components/navigation/BottomNav";

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

        <text style={styles.categoryTitle}>
          Categories
        </text>

        <text style={styles.categorySubtitle}>
          Pick a topic and start fact-checking
        </text>

      <View style={styles.categoryContainer1}>
        
      <CategoryCard
        title="Science"
        icon="flask-outline"
        onPress={() => router.push("/")}
      />

      <CategoryCard
        title="Science"
        icon="flask-outline"
        onPress={() => router.push("/")}
      />
      </View>
      
      <View style={styles.categoryContainer2}>
      <CategoryCard
        title="Science"
        icon="flask-outline"
        onPress={() => router.push("/")}
      />

      <CategoryCard
        title="Science"
        icon="flask-outline"
        onPress={() => router.push("/")}
      />
      </View>

      <View style={styles.categoryContainer3}>
      <CategoryCard
        title="Science"
        icon="flask-outline"
        onPress={() => router.push("/")}
      />

      <CategoryCard
        title="Science"
        icon="flask-outline"
        onPress={() => router.push("/")}
      />
      </View>

      <BottomNav current="play" />

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
    categoryContainer3: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

});