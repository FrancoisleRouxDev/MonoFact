import { Pressable, View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";


type StatCardProps = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconBackgroundColor?: string;
};

export default function StatCard({
  title,
  subtitle,
  icon: Icon,
  iconBackgroundColor = "#EEF2FF",
}: StatCardProps) {
  return (
    <Pressable style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        <Icon size={26} color={Colors.primaryDark} />
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: Colors.surface,
    borderRadius: 20,
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

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  title: {
    ...Typography.h3,
    color: Colors.text,
  },

  subtitle: {
    marginTop: 4,
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});