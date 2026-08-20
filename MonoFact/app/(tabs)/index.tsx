import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/app/services/config";

import HomeHeader from "@/components/layout/HomeHeader";
import ContinueCard from "@/components/cards/ContinueCard";
import CategoriesGrid from "@/components/layout/CategoryGrid";
import DailyChallengeCard from "@/components/cards/DailyChallengeCard";
import BottomNav from "@/components/navigation/BottomNav";

export default function HomeScreen() {
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const snapshot = await getDoc(
          doc(db, "users", currentUser.uid)
        );

        if (snapshot.exists()) {
          setUserData(snapshot.data());
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUser();
  }, []);

  const totalAnswers =
    (userData?.totalCorrect ?? 0) +
    (userData?.totalIncorrect ?? 0);

  const accuracy =
    totalAnswers === 0
      ? 0
      : Math.round(((userData?.totalCorrect ?? 0) / totalAnswers) * 100);

  const hasLastPosition =
    userData?.lastCategory != null &&
    userData?.lastQuestionIndex != null;

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <HomeHeader
          username={userData?.username ?? ""}
          xp={userData?.xp ?? 0}
          streak={userData?.currentStreak ?? 0}
          accuracy={accuracy}
        />

        {hasLastPosition && (
          <ContinueCard
            title="Continue where you left off"
            category={userData.lastCategory}
            onPress={() =>
              router.push({
                pathname: "/game/[category]",
                params: {
                  category: userData.lastCategory,
                  index: String(userData.lastQuestionIndex),
                  correctAnswers: "0",
                },
              })
            }
          />
        )}

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