import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { useUser } from "@/app/context/UserContext";

import {
  Flame,
  Trophy,
  Rocket,
  Globe,
  Zap,
  Star,
  Target,
  Brain,
  Gamepad2,
  Swords,
  Medal,
  Crown,
  FlaskConical,
  Moon,
  Sun,
  Clock,
  Hand,
  Layers,
  Lock,
} from "lucide-react-native";

// ---------------------------------------------------------------------------
// Achievement definition type
// ---------------------------------------------------------------------------
type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  hidden: boolean;
};

// ---------------------------------------------------------------------------
// Full achievement list — 27 achievements across 8 categories
// ---------------------------------------------------------------------------
const ACHIEVEMENTS: Achievement[] = [

  // Streak based
  {
    id: "first_spark",
    name: "First Spark",
    description: "Get 3 correct answers in a row",
    icon: Flame,
    category: "Streak",
    hidden: false,
  },
  {
    id: "on_fire",
    name: "On Fire",
    description: "Get 7 correct answers in a row",
    icon: Flame,
    category: "Streak",
    hidden: false,
  },
  {
    id: "unstoppable",
    name: "Unstoppable",
    description: "Get 15 correct answers in a row",
    icon: Rocket,
    category: "Streak",
    hidden: false,
  },
  {
    id: "legendary",
    name: "Legendary",
    description: "Get 30 correct answers in a row",
    icon: Crown,
    category: "Streak",
    hidden: false,
  },

  // Daily challenge
  {
    id: "daily_devotee",
    name: "Daily Devotee",
    description: "Complete your first daily challenge",
    icon: Star,
    category: "Daily",
    hidden: false,
  },
  {
    id: "consistent",
    name: "Consistent",
    description: "Complete 7 daily challenges",
    icon: Star,
    category: "Daily",
    hidden: false,
  },
  {
    id: "dedicated_scholar",
    name: "Dedicated Scholar",
    description: "Complete 30 daily challenges",
    icon: Star,
    category: "Daily",
    hidden: false,
  },

  // Score based
  {
    id: "perfect_round",
    name: "Perfect Round",
    description: "Answer all 25 questions correctly in a category",
    icon: Trophy,
    category: "Score",
    hidden: false,
  },
  {
    id: "sharp_mind",
    name: "Sharp Mind",
    description: "Reach 80% overall accuracy",
    icon: Brain,
    category: "Score",
    hidden: false,
  },
  {
    id: "flawless",
    name: "Flawless",
    description: "Complete a daily challenge with 100% accuracy",
    icon: Target,
    category: "Score",
    hidden: false,
  },

  // Exploration based
  {
    id: "curious_mind",
    name: "Curious Mind",
    description: "Start your first category",
    icon: FlaskConical,
    category: "Explorer",
    hidden: false,
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Complete a full category",
    icon: Globe,
    category: "Explorer",
    hidden: false,
  },
  {
    id: "globetrotter",
    name: "Globetrotter",
    description: "Complete 3 different categories",
    icon: Globe,
    category: "Explorer",
    hidden: false,
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Complete all 6 categories",
    icon: Medal,
    category: "Explorer",
    hidden: false,
  },

  // XP / Level based
  {
    id: "first_steps",
    name: "First Steps",
    description: "Reach level 2",
    icon: Zap,
    category: "Level",
    hidden: false,
  },
  {
    id: "rising_star",
    name: "Rising Star",
    description: "Reach level 5",
    icon: Zap,
    category: "Level",
    hidden: false,
  },
  {
    id: "fact_machine",
    name: "Fact Machine",
    description: "Reach level 10",
    icon: Zap,
    category: "Level",
    hidden: false,
  },
  {
    id: "enlightened",
    name: "Enlightened",
    description: "Reach level 20",
    icon: Layers,
    category: "Level",
    hidden: false,
  },

  // Games based
  {
    id: "rookie",
    name: "Rookie",
    description: "Play your first game",
    icon: Gamepad2,
    category: "Games",
    hidden: false,
  },
  {
    id: "dedicated",
    name: "Dedicated",
    description: "Play 10 games",
    icon: Gamepad2,
    category: "Games",
    hidden: false,
  },
  {
    id: "veteran",
    name: "Veteran",
    description: "Play 50 games",
    icon: Swords,
    category: "Games",
    hidden: false,
  },
  {
    id: "elite",
    name: "Elite",
    description: "Play 100 games",
    icon: Crown,
    category: "Games",
    hidden: false,
  },

  // Swipe based
  {
    id: "quick_draw",
    name: "Quick Draw",
    description: "Answer 10 facts using swipe only",
    icon: Hand,
    category: "Swipe",
    hidden: false,
  },
  {
    id: "swipe_master",
    name: "Swipe Master",
    description: "Answer 100 facts using swipe only",
    icon: Hand,
    category: "Swipe",
    hidden: false,
  },

  // Hidden
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Play between midnight and 3am",
    icon: Moon,
    category: "Hidden",
    hidden: true,
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Play between 3am and 7am",
    icon: Sun,
    category: "Hidden",
    hidden: true,
  },
  {
    id: "fact_addict",
    name: "Fact Addict",
    description: "Play 3 games in one day",
    icon: Clock,
    category: "Hidden",
    hidden: true,
  },
];

// ---------------------------------------------------------------------------
// Category order for grouped display
// ---------------------------------------------------------------------------
const CATEGORY_ORDER = [
  "Streak",
  "Score",
  "Level",
  "Games",
  "Explorer",
  "Daily",
  "Swipe",
  "Hidden",
];

// ---------------------------------------------------------------------------
// AchievementsCard
// ---------------------------------------------------------------------------
// Displays all 27 achievements grouped by category.
// Earned achievements show in full colour with their real name and description.
// Unearned achievements are greyed out.
// Hidden unearned achievements show "???" instead of their real name.
// ---------------------------------------------------------------------------
export default function AchievementsCard() {

  const { userData } = useUser();

  // Map of earned achievement IDs from Firestore
  const earned: Record<string, boolean> =
    userData?.achievements ?? {};

  // Group achievements by category
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: ACHIEVEMENTS.filter((a) => a.category === cat),
  }));

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>
        Achievements
      </Text>

      <Text style={styles.subheading}>
        {Object.keys(earned).length} / {ACHIEVEMENTS.length} unlocked
      </Text>

      {grouped.map(({ category, items }) => (
        <View key={category} style={styles.section}>

          {/* Category label */}
          <Text style={styles.categoryLabel}>
            {category}
          </Text>

          {/* Two column grid of badges */}
          <View style={styles.grid}>
            {items.map((achievement) => {
              const isEarned = earned[achievement.id] === true;
              const isHiddenAndLocked =
                achievement.hidden && !isEarned;
              const Icon = achievement.icon;

              return (
                <View
                  key={achievement.id}
                  style={[
                    styles.badge,
                    isEarned
                      ? styles.badgeEarned
                      : styles.badgeLocked,
                  ]}
                >
                  {/* Icon */}
                  <View style={[
                    styles.iconContainer,
                    isEarned
                      ? styles.iconEarned
                      : styles.iconLocked,
                  ]}>
                    {isHiddenAndLocked ? (
                      <Lock
                        size={18}
                        color={Colors.textSecondary}
                      />
                    ) : (
                      <Icon
                        size={18}
                        color={isEarned
                          ? Colors.primary
                          : Colors.textSecondary}
                      />
                    )}
                  </View>

                  {/* Name and description */}
                  <View style={styles.badgeTextContainer}>
                    <Text style={[
                      styles.badgeName,
                      !isEarned && styles.badgeNameLocked,
                    ]}>
                      {isHiddenAndLocked
                        ? "???"
                        : achievement.name}
                    </Text>

                    <Text style={[
                      styles.badgeDescription,
                      !isEarned && styles.badgeDescriptionLocked,
                    ]}>
                      {isHiddenAndLocked
                        ? "Keep playing to unlock"
                        : achievement.description}
                    </Text>
                  </View>

                </View>
              );
            })}
          </View>

        </View>
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,

    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 5,
  },

  heading: {
    ...Typography.h3,
    color: Colors.primaryDark,
    marginBottom: 4,
  },

  subheading: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },

  section: {
    marginBottom: Spacing.lg,
  },

  categoryLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },

  badge: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: 14,
    gap: Spacing.xs,
  },

  badgeEarned: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.primary + "30",
  },

  badgeLocked: {
    backgroundColor: Colors.surfaceLight,
    opacity: 0.5,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  iconEarned: {
    backgroundColor: Colors.primary + "20",
  },

  iconLocked: {
    backgroundColor: Colors.surfaceLight,
  },

  badgeTextContainer: {
    flex: 1,
  },

  badgeName: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: "700",
  },

  badgeNameLocked: {
    color: Colors.textSecondary,
  },

  badgeDescription: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  badgeDescriptionLocked: {
    color: Colors.textSecondary,
    opacity: 0.7,
  },
});