import { Pressable, Text, StyleSheet, View } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";


type BottomNavItemProps = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onPress: () => void;
};

export default function BottomNavItem({
  label,
  icon: Icon,
  active = false,
  onPress,
}: BottomNavItemProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.iconContainer, active && styles.activeBackground]}>
        <Icon
          size={24}
          color={active ? Colors.primaryDark : Colors.textSecondary}
          strokeWidth={2.2}
        />
      </View>

      <Text
        style={[
          styles.label,
          active && styles.activeLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  iconContainer: {
    width: 58,
    height: 42,
    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",
  },

  activeBackground: {
    backgroundColor: Colors.surfaceLight,
  },

  label: {
    marginTop: Spacing.xs,
    ...Typography.small,
    color: Colors.textSecondary,
    fontWeight: "500",
  },

  activeLabel: {
    color: Colors.primaryDark,
    fontWeight: "700",
  },
});