import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

import {
  FlaskConical,
  Leaf,
  PawPrint,
  Telescope,
  LucideIcon,
} from "lucide-react-native";

import CategoryCard from "@/components/cards/CategoryCard";

type Category = {
  title: string;
  facts: number;
  icon: LucideIcon;
  color: string;
};

export default function CategoriesGrid() {

  const categories: Category[] = [
    {
      title: "Nature",
      facts: 25,
      icon: Leaf,
      color: Colors.categories.nature,
    },
    {
      title: "Science",
      facts: 25,
      icon: FlaskConical,
      color: Colors.categories.science,
    },
    {
      title: "Animals",
      facts: 25,
      icon: PawPrint,
      color: Colors.categories.animals,
    },
    {
      title: "Space",
      facts: 25,
      icon: Telescope,
      color: Colors.categories.space,
    },
  ];

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.title}>
          Categories
        </Text>

        <Text style={styles.link}>
          See all
        </Text>

      </View>

      <View style={styles.grid}>

        {categories.map((category) => (
          <CategoryCard
            key={category.title}
            title={category.title}
            subtitle={`${category.facts} facts`}
            icon={category.icon}
            color={category.color}
            onPress={() => {}}
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