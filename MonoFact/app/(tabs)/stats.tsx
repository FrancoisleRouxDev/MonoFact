import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";


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
    iconBackgroundColor: "#EEF2FA",
  },
  {
    icon: Check,
    title: "187",
    subtitle: "Correct Answers",
    iconBackgroundColor: "#E4F7F4",
  },
  {
    icon: X,
    title: "48",
    subtitle: "Incorrect Answers",
    iconBackgroundColor: "#FDEEEF",
  },
  {
    icon: Target,
    title: "79.6%",
    subtitle: "Accuracy",
    iconBackgroundColor: "#E6F2FA",
  },
  {
    icon: Flame,
    title: "12",
    subtitle: "Best Streak",
    iconBackgroundColor: "#FFF3DE",
  },
  {
    icon: FlaskConical,
    title: "Science",
    subtitle: "Fav. Category",
    iconBackgroundColor: "#EAE6FF",
  },
];

export default function StatsScreen() {

  return (
    <SafeAreaView style={styles.container}>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >

              <View style={styles.header}>
                <Text style={styles.categoryTitle}>
                  Statistics
                </Text>

                <Text style={styles.categorySubtitle}>
                  Your performance at a glance
                </Text>
              </View>

            <View style={styles.statsGrid}>
              {stats.map((stat) => (
                <StatCard
                  key={stat.subtitle}
                  icon={stat.icon}
                  title={stat.title}
                  subtitle={stat.subtitle}
                  iconBackgroundColor={stat.iconBackgroundColor}
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },

});