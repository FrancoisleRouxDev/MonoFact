import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, LucideIcon } from "lucide-react-native";

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
            color="#20233D"
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
        color="#C9CEDD"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: "#ECEEF4",
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
    fontWeight: "600",
    color: "#20233D",
  },

  subtitle: {
    color: "#97A1C2",
    marginTop: 2,
  },
});