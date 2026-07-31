import { Pressable, View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";


type CategoryCardProps = {
  title: string;
  subtitle?: string;
  progress?: number; // 0 - 100
  icon: LucideIcon;
  color: string;
  iconBackgroundColor?: string;
  onPress: () => void;
};

export default function CategoryCard({
  title,
  subtitle,
  progress,
  icon: Icon,
  color,
  iconBackgroundColor = "#EDF4F8",
  onPress,
}: CategoryCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        <Icon size={26} color={color} />
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>{subtitle ?? "25 facts"}</Text>

      {progress !== undefined && (
        <View style={styles.progressRow}>
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: color,
                },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {progress}%
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: 16,

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
    fontSize: Typography.title.fontSize,
    fontWeight: "600",
    color: Colors.text,
  },

  subtitle: {
    marginTop: 4,
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.caption.fontWeight,
    color: Colors.textSecondary,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },

  progressBackground: {
      flex: 1,
      height: 8,
      backgroundColor: "#E6E8EE",
      borderRadius: 999,
      overflow: "hidden",
  },

  progressFill: {
      height: "100%",
      borderRadius: 999,
  },

  progressText: {
      fontSize: Typography.small.fontSize,
      fontWeight: "600",
      color: Colors.textSecondary,
  },
});