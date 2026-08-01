import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type SettingsItemProps = {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  onPress: () => void;
};

export default function SettingsItem({
  title,
  subtitle,
  icon: Icon,
  onPress,
}: SettingsItemProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.left}>
        <View style={styles.iconContainer}>
          <Icon
            size={26}
            color={Colors.primaryDark}
          />
        </View>

        <View>
          <Text style={styles.title}>
            {title}
          </Text>

          {subtitle && (
            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <ChevronRight
        size={20}
        color={Colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.sm,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,

    borderRadius: 12,

    backgroundColor: Colors.surfaceLight,

    justifyContent: "center",
    alignItems: "center",

    marginRight: Spacing.md,
  },

  title: {
    ...Typography.body,
    fontWeight: "600",
    color: Colors.text,
  },

  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});