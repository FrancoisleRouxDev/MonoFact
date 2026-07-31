import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

import HomeHeader from "@/components/layout/HomeHeader";
import ContinueCard from "@/components/cards/ContinueCard";
import CategoriesGrid from "@/components/layout/CategoryGrid";
import DailyChallengeCard from "@/components/cards/DailyChallengeCard";
import BottomNav from "@/components/navigation/BottomNav";

export default function HomeScreen() {

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <HomeHeader />

        <ContinueCard 
          title="Continue where you left off"
          category="Science - Round 3"
          onPress={() => {}}
        />

        <CategoriesGrid />

        <DailyChallengeCard
            title="Mixed Facts"
            description="+500 bonus XP today only"
            reward="Reward: +500 XP"
            onPress={() => router.push("/")}
          />

      </ScrollView>

      <BottomNav current="home" />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
  },

  scrollContent: {
    paddingBottom: Spacing.xl,
  },
});