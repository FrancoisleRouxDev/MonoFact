import { SafeAreaView, ScrollView, View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

import { Zap, Target, Gamepad2, FlaskConical } from "lucide-react-native";

import ProfileHeader from "@/components/newcomps/ProfileHeader";
import ProfileStatCard from "@/components/cards/ProfileStatCard";
import AchievementsCard from "@/components/cards/AchiementCard";
import BottomNav from "@/components/navigation/BottomNav";

export default function ProfileScreen() {

  const stats = [
    {
      icon: Zap,
      value: "4,820",
      label: "Total XP",
    },
    {
      icon: Target,
      value: "84%",
      label: "Accuracy",
    },
    {
      icon: Gamepad2,
      value: "47",
      label: "Games Played",
    },
    {
      icon: FlaskConical,
      value: "Science",
      label: "Fav. Category",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <ProfileHeader
          username="John Doe"
          email="john.doe@email.com"
          level="Level 7 • Fact Explorer"
        />

        <View style={styles.statsContainer}>
          {stats.map((stat) => (
            <ProfileStatCard
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </View>

        <AchievementsCard />

      </ScrollView>

      <BottomNav current="profile" />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",

    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
});