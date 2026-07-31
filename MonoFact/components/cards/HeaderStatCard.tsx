import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";


type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
};

export default function StatCard({
  icon,
  value,
  label,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <Ionicons
        name={icon}
        size={24}
        color={Colors.surface}
      />

      <Text style={styles.value}>
        {value}
      </Text>

      <Text style={styles.label}>
        {label}
      </Text>
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