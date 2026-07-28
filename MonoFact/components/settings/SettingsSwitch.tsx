import { View, Text, StyleSheet, Switch } from "react-native";
import { LucideIcon } from "lucide-react-native";

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
            color="#20233D"
          />
        </View>

        <Text style={styles.title}>
          {title}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,

    borderRadius: 12,

    backgroundColor: "#EEF3FB",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#20233D",
  },
});