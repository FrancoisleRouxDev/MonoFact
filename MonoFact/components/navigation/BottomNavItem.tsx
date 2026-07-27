import { Pressable, Text, StyleSheet, View } from "react-native";
import { LucideIcon } from "lucide-react-native";

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
          size={28}
          color={active ? "#000" : "#A9A9A9"}
          strokeWidth={2.5}
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
    width: 64,
    height: 48,
    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",
  },

  activeBackground: {
    backgroundColor: "#EEF2FA",
  },

  label: {
    marginTop: 8,
    fontSize: 13,
    color: "#B0B0B0",
    fontWeight: "500",
  },

  activeLabel: {
    color: "#000",
    fontWeight: "700",
  },
});