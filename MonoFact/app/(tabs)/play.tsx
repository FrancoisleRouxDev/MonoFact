import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import { useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

// Components
import CategoryCard from "@/components/cards/CategoryCard";
import BottomNav from "@/components/navigation/BottomNav";
import { useUser } from "@/app/context/UserContext";

// Icons
import {
  FlaskConical,
  Leaf,
  PawPrint,
  Telescope,
  Camera,
  Cpu,
} from "lucide-react-native";

// ---------------------------------------------------------------------------
// FACTS_PER_CATEGORY
// ---------------------------------------------------------------------------
// How many facts exist in each category in Firestore.
// Changing this one value updates progress bars and subtitles everywhere.
// ---------------------------------------------------------------------------
const FACTS_PER_CATEGORY = 25;

// ---------------------------------------------------------------------------
// CategoryItem
// ---------------------------------------------------------------------------
// Internal type for the category list rendered on this screen.
// ---------------------------------------------------------------------------
type CategoryItem = {
  title: string;
  subtitle: string;
  progress: number;
  icon: typeof Leaf;
  color: string;
  iconBackgroundColor: string;
};

// ---------------------------------------------------------------------------
// getProgressPercentage
// ---------------------------------------------------------------------------
// Converts a raw answered-count into a 0–100 percentage.
// Caps at 100% in case answered somehow exceeds the total.
// ---------------------------------------------------------------------------
const getProgressPercentage = (
  answered: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.min(100, Math.round((answered / total) * 100));
};

// ---------------------------------------------------------------------------
// getCategorySubtitle
// ---------------------------------------------------------------------------
// Builds the subtitle string shown under each category card.
//   - First visit: "25 facts • ~5 min"
//   - Returning:   "12 / 25 answered • 83% correct"
// ---------------------------------------------------------------------------
const getCategorySubtitle = (
  categoryStats: { correct?: number; incorrect?: number } | undefined,
  total: number
): string => {
  const correct = categoryStats?.correct ?? 0;
  const incorrect = categoryStats?.incorrect ?? 0;
  const answered = correct + incorrect;

  if (answered === 0) {
    return `${total} facts • ~5 min`;
  }

  const accuracy = Math.round((correct / answered) * 100);
  return `${answered} / ${total} answered • ${accuracy}% correct`;
};

// ---------------------------------------------------------------------------
// PlayScreen (file: app/(tabs)/play.tsx)
// ---------------------------------------------------------------------------
// Shows all 6 categories as cards. Each card displays the user's progress
// and accuracy for that category. Tapping a card starts a game.
// Reads from shared UserContext instead of fetching Firestore directly —
// no duplicate network calls when switching tabs.
// ---------------------------------------------------------------------------
export default function PlayScreen() {

  const router = useRouter();

  // Pull user data from shared context instead of fetching Firebase directly
  const { userData } = useUser();

  if (!userData) return null;

  // Build the category list using FACTS_PER_CATEGORY so all counts
  // update automatically if the fact library grows.
  const categories: CategoryItem[] = [
    {
      title: "Nature",
      subtitle: getCategorySubtitle(userData.categoryStats?.Nature, FACTS_PER_CATEGORY),
      progress: getProgressPercentage(userData.progress?.Nature ?? 0, FACTS_PER_CATEGORY),
      icon: Leaf,
      color: Colors.categories.nature,
      iconBackgroundColor: "#E5F7F5",
    },
    {
      title: "Science",
      subtitle: getCategorySubtitle(userData.categoryStats?.Science, FACTS_PER_CATEGORY),
      progress: getProgressPercentage(userData.progress?.Science ?? 0, FACTS_PER_CATEGORY),
      icon: FlaskConical,
      color: Colors.categories.science,
      iconBackgroundColor: "#E7F0F8",
    },
    {
      title: "Animals",
      subtitle: getCategorySubtitle(userData.categoryStats?.Animals, FACTS_PER_CATEGORY),
      progress: getProgressPercentage(userData.progress?.Animals ?? 0, FACTS_PER_CATEGORY),
      icon: PawPrint,
      color: Colors.categories.animals,
      iconBackgroundColor: "#FFF3DC",
    },
    {
      title: "Space",
      subtitle: getCategorySubtitle(userData.categoryStats?.Space, FACTS_PER_CATEGORY),
      progress: getProgressPercentage(userData.progress?.Space ?? 0, FACTS_PER_CATEGORY),
      icon: Telescope,
      color: Colors.categories.space,
      iconBackgroundColor: "#E7ECF6",
    },
    {
      title: "Photography",
      subtitle: getCategorySubtitle(userData.categoryStats?.Photography, FACTS_PER_CATEGORY),
      progress: getProgressPercentage(userData.progress?.Photography ?? 0, FACTS_PER_CATEGORY),
      icon: Camera,
      color: Colors.categories.photography,
      iconBackgroundColor: "#FDE7EB",
    },
    {
      title: "Technology",
      subtitle: getCategorySubtitle(userData.categoryStats?.Technology, FACTS_PER_CATEGORY),
      progress: getProgressPercentage(userData.progress?.Technology ?? 0, FACTS_PER_CATEGORY),
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
              onPress={() =>
                router.push({
                  pathname: "/game/[category]",
                  params: {
                    category: category.title,
                  },
                })
              }
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