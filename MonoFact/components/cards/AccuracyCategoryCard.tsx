import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type CategoryStat = {
  accuracy: number;
  gamesPlayed: number;
};

type Props = {
  data?: Record<string, CategoryStat>;
};

const categoryColors: Record<string, string> = {
  Science: Colors.categories.science,
  Nature: Colors.categories.nature,
  Animals: Colors.categories.animals,
  Space: Colors.categories.space,
  Photography: Colors.categories.photography,
  Technology: Colors.categories.technology,
};

export default function AccuracyCategoryCard({ data }: Props) {
  if (!data) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Accuracy by Category</Text>

      {Object.entries(data).map(([name, stats]) => (
        <View key={name} style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.category}>{name}</Text>

            <Text style={styles.percent}>{stats.accuracy}%</Text>
          </View>

          <View style={styles.barBackground}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${stats.accuracy}%`,
                  backgroundColor: categoryColors[name] ?? Colors.primary,
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