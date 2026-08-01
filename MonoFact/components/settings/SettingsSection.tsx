import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function SettingsSection({
  title,
  children,
}: SettingsSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    elevation: 4,
  },

  heading: {
    ...Typography.small,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
});