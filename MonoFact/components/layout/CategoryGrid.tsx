import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

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
};

export default function CategoriesGrid() {

  const categories: Category[] = [
    {
      title: "Nature",
      facts: 25,
      icon: Leaf,
    },
    {
      title: "Science",
      facts: 25,
      icon: FlaskConical,
    },
    {
      title: "Animals",
      facts: 25,
      icon: PawPrint,
    },
    {
      title: "Space",
      facts: 25,
      icon: Telescope,
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
            facts={category.facts}
            icon={category.icon}
            onPress={() => {}}
          />
        ))}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    paddingHorizontal: 20,
    marginTop: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1D1D1D",
  },

  link: {
    color: "#8A8A8A",
    fontSize: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});