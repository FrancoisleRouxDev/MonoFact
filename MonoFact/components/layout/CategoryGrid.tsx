import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { useRouter } from "expo-router";

import {
  FlaskConical,
  Leaf,
  PawPrint,
  Telescope,
  LucideIcon,
} from "lucide-react-native";

import CategoryCard from "@/components/cards/CategoryCard";

// ---------------------------------------------------------------------------
// Type definition for each category item displayed in the grid.
// ---------------------------------------------------------------------------
type Category = {
  title: string;
  facts: number;
  icon: LucideIcon;
  color: string;
  iconBackgroundColor?: string;
};

// ---------------------------------------------------------------------------
// CategoriesGrid
// ---------------------------------------------------------------------------
// Shown on the Home screen as a preview of categories.
// - Tapping any category card navigates directly to /game/[category]
// - Tapping "See all" navigates to the Play tab (/ (tabs)/play)
// ---------------------------------------------------------------------------
export default function CategoriesGrid() {
  const router = useRouter();

  const categories: Category[] = [
    {
      title: "Nature",
      facts: 25,
      icon: Leaf,
      color: Colors.categories.nature,
      iconBackgroundColor: "#E5F7F5",
    },
    {
      title: "Science",
      facts: 25,
      icon: FlaskConical,
      color: Colors.categories.science,
      iconBackgroundColor: "#E7F0F8",
    },
    {
      title: "Animals",
      facts: 25,
      icon: PawPrint,
      color: Colors.categories.animals,
      iconBackgroundColor: "#FFF3DC",
    },
    {
      title: "Space",
      facts: 25,
      icon: Telescope,
      color: Colors.categories.space,
      iconBackgroundColor: "#E7ECF6",
    },
  ];

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>

        {/* "See all" button navigates to the full Play tab */}
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => router.push("/(tabs)/play")}
        >
          <Text style={styles.link}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {categories.map((category) => (
          <CategoryCard
            key={category.title}
            title={category.title}
            subtitle={`${category.facts} facts`}
            icon={category.icon}
            color={category.color}
            iconBackgroundColor={category.iconBackgroundColor}
            onPress={() =>
              router.push({
                pathname: "/game/[category]",
                params: { category: category.title },
              })
            }
          />
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },

  title: {
    ...Typography.h3,
    color: Colors.text,
  },

  // "See all" — styled like a subtle link
  link: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },

});