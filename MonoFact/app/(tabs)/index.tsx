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

  // const user = await getCurrentUserProfile();

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* <HomeHeader
            username={user.username}
            xp={user.xp}
            streak={user.currentStreak}
            accuracy={Math.round(
                (user.totalCorrect /
                (user.totalCorrect + user.totalIncorrect)) * 100
            )}
        /> */}

        <HomeHeader
        // username="Francois"
        // xp={1250}
        // streak={5}
        // accuracy={92}
        />

        <ContinueCard
          title="Continue where you left off"
          category="Science - Round 3"
          onPress={() => { }}
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
    paddingBottom: 120,
  },
});