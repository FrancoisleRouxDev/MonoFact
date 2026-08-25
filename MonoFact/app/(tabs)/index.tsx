import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useUser } from "@/app/context/UserContext";

import HomeHeader from "@/components/layout/HomeHeader";
import ContinueCard from "@/components/cards/ContinueCard";
import CategoriesGrid from "@/components/layout/CategoryGrid";
import DailyChallengeCard from "@/components/cards/DailyChallengeCard";
import BottomNav from "@/components/navigation/BottomNav";

// ---------------------------------------------------------------------------
// HomeScreen (file: app/(tabs)/index.tsx)
// ---------------------------------------------------------------------------
// The main landing screen after user login.
// Displays:
//   1. HomeHeader with live XP, streak, and accuracy metrics
//   2. ContinueCard (if the player paused mid-game in a previous session)
//   3. CategoriesGrid with direct game links and a "See all" link to the Play tab
//   4. DailyChallengeCard for quick engagement
//   5. BottomNav persistent bar
// ---------------------------------------------------------------------------
export default function HomeScreen() {
  const router = useRouter();

  // Pull user data from shared context instead of fetching Firebase directly
  const { userData } = useUser();

  // Check whether the user has a saved mid-game position to resume
  const hasLastPosition =
    userData?.lastCategory != null &&
    userData?.lastQuestionIndex != null;

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Dynamic header showing user greeting and quick stats */}
        <HomeHeader />

        {/* Continue where you left off - only visible when a game was paused */}
        {hasLastPosition && (
          <ContinueCard
            title="Continue where you left off"
            category={userData!.lastCategory!}
            onPress={() =>
              router.push({
                pathname: "/game/[category]",
                params: {
                  category: userData!.lastCategory!,
                  index: String(userData!.lastQuestionIndex),
                  correctAnswers: "0",
                },
              })
            }
          />
        )}

        {/* Categories preview grid: tapping a card starts the game; "See all" opens the full Play tab */}
        <CategoriesGrid />

        {/* Daily Challenge Card - navigates to the Play tab */}
        <DailyChallengeCard
          title="Mixed Facts"
          description="+500 bonus XP today only"
          reward="Reward: +500 XP"
          onPress={() => router.push("/game/daily")}
        />

      </ScrollView>

      {/* Persistent bottom navigation bar */}
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