import { View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";


type Props = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export default function ProfileStatCard({
  icon: Icon,
  value,
  label,
}: Props) {
  return (
    <View style={styles.card}>

      <Icon
        size={28}
        color={Colors.primaryDark}
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
    width: "47%",
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.md,

    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 5,
  },

  value: {
    ...Typography.h2,
    marginTop: Spacing.md,
    color: Colors.textSecondary,
  },

  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});