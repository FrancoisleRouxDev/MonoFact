import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

// Components
import CategoryCard from "@/components/cards/CategoryCard";
import BottomNav from "@/components/navigation/BottomNav";

// Icons
import { FlaskConical, Leaf, PawPrint, Telescope, Globe, Landmark,  } from "lucide-react-native";

export default function HomeScreen() {

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

          <Text style={styles.categoryTitle}>
            Categories
          </Text>

          <Text style={styles.categorySubtitle}>
            Pick a topic and start fact-checking
          </Text>

        <View style={styles.categoryContainer1}>
          
        <CategoryCard
          title="Science"
          icon={FlaskConical}
          onPress={() => router.push("/game/[category]")}
        />

        <CategoryCard
          title="Nature"
          icon={Leaf}
          onPress={() => router.push("/")}
        />

        <CategoryCard
          title="Animals"
          icon={PawPrint}
          onPress={() => router.push("/")}
        />

        <CategoryCard
          title="Space"
          icon={Telescope}
          onPress={() => router.push("/")}
        />

        <CategoryCard
          title="History"
          icon={Landmark}
          onPress={() => router.push("/")}
        />

        <CategoryCard
          title="Geography"
          icon={Globe}
          onPress={() => router.push("/")}
        />
        </View>
      </ScrollView>
    <BottomNav current="play" />
    
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