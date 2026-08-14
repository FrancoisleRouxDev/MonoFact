import { View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type StatCardProps = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export default function StatCard({
  icon: Icon,
  value,
  label,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <Icon
        size={24}
        color={Colors.surface}
        strokeWidth={2.3}
      />

      <Text style={styles.value}>{value}</Text>

      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 106,

    backgroundColor: "rgba(255, 255, 255, 0.12)",

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },

  value: {
    ...Typography.title,
    color: Colors.surface,
    marginTop: 8,
  },

  label: {
    ...Typography.caption,
    color: "rgba(255, 255, 255, 0.72)",
    marginTop: 3,
  },
});