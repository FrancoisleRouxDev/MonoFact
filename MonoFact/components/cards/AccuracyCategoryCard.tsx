import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";


const categories = [
  {
    name: "Science",
    accuracy: 84,
    color: Colors.categories.science,
  },
  {
    name: "Nature",
    accuracy: 78,
    color: Colors.categories.nature,
  },
  {
    name: "Animals",
    accuracy: 91,
    color: Colors.categories.animals,
  },
  {
    name: "Space",
    accuracy: 65,
    color: Colors.categories.space,
  },
];

export default function AccuracyCategoryCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Accuracy by Category</Text>

      {categories.map((item) => (
        <View key={item.name} style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.category}>{item.name}</Text>
            <Text style={styles.percent}>{item.accuracy}%</Text>
          </View>

          <View style={styles.barBackground}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${item.accuracy}%`,
                  backgroundColor: item.color,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,

    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },

  title: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },

  row: {
    marginBottom: Spacing.md,
  },

  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },

  category: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: "500",
  },

  percent: {
    ...Typography.body,
    fontWeight: "700",
    color: Colors.text,
  },

  barBackground: {
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 999,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: 999,
  },
});