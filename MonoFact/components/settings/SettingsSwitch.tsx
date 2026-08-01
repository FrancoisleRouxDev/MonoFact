import { View, Text, StyleSheet, Switch } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type SettingsSwitchProps = {
  title: string;
  icon: LucideIcon;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export default function SettingsSwitch({
  title,
  icon: Icon,
  value,
  onValueChange,
}: SettingsSwitchProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconContainer}>
          <Icon
            size={22}
            color={Colors.primaryDark}
          />
        </View>

        <Text style={styles.title}>
          {title}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.border, true: Colors.textSecondary }}
        thumbColor={Colors.surface}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontWeight: "500",
    color: Colors.text,
  },
});