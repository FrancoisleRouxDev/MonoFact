import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";


// Components
import CategoryCard from "@/components/cards/CategoryCard";
import BottomNav from "@/components/navigation/BottomNav";

// Icons
import { FlaskConical, Leaf, PawPrint, Telescope, Camera, Cpu } from "lucide-react-native";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/app/services/config";

type CategoryItem = {
  title: string;
  subtitle: string;
  progress: number;
  icon: typeof Leaf;
  color: string;
  iconBackgroundColor: string;
};

export default function PlayScreen() {

  const router = useRouter();


  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      const snapshot = await getDoc(doc(db, "users", currentUser.uid));

      if (snapshot.exists()) {
        setUserData(snapshot.data());
      }
    };

    loadUser();
  }, []);

  if (!userData) return null;

  const categories: CategoryItem[] = [
    {
      title: "Nature",
      subtitle: "25 facts • ~5 min",
      progress: userData.progress?.Nature ?? 0,
      icon: Leaf,
      color: Colors.categories.nature,
      iconBackgroundColor: "#E5F7F5",
    },
    {
      title: "Science",
      subtitle: "25 facts • ~5 min",
      progress: userData.progress?.Science ?? 0,
      icon: FlaskConical,
      color: Colors.categories.science,
      iconBackgroundColor: "#E7F0F8",
    },
    {
      title: "Animals",
      subtitle: "25 facts • ~5 min",
      progress: userData.progress?.Animals ?? 0,
      icon: PawPrint,
      color: Colors.categories.animals,
      iconBackgroundColor: "#FFF3DC",
    },
    {
      title: "Space",
      subtitle: "25 facts • ~5 min",
      progress: userData.progress?.Space ?? 0,
      icon: Telescope,
      color: Colors.categories.space,
      iconBackgroundColor: "#E7ECF6",
    },
    {
      title: "Photography",
      subtitle: "25 facts • ~5 min",
      progress: userData.progress?.Photography ?? 0,
      icon: Camera,
      color: Colors.categories.photography,
      iconBackgroundColor: "#FDE7EB",
    },
    {
      title: "Technology",
      subtitle: "25 facts • ~5 min",
      progress: userData.progress?.Technology ?? 0,
      icon: Cpu,
      color: Colors.categories.technology,
      iconBackgroundColor: "#ECE9FF",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.header}>

          <Text style={styles.categoryTitle}>
            Choose a Category
          </Text>

          <Text style={styles.categorySubtitle}>
            Pick a topic and start fact-checking
          </Text>

        </View>

        <View style={styles.categoryGrid}>

          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              icon={category.icon}
              subtitle={category.subtitle}
              progress={category.progress}
              onPress={() => router.push({ pathname: "/game/[category]", params: { category: "Science" } })}
              color={category.color}
              iconBackgroundColor={category.iconBackgroundColor}
            />
          ))}

        </View>

      </ScrollView>

      <BottomNav current="play" />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 120,
  },

  header: {
    marginBottom: Spacing.lg,
  },

  categoryTitle: {
    ...Typography.h2,
    color: Colors.primaryDark,
  },

  categorySubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

});