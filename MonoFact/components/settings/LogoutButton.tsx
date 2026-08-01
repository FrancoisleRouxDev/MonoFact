import { Pressable, StyleSheet, Text } from "react-native";
import { LogOut } from "lucide-react-native";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type LogoutButtonProps = {
  onPress?: () => void;
};

export default function LogoutButton({
  onPress,
}: LogoutButtonProps) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
    >
      <LogOut
        size={22}
        color="#FF4D57"
      />

      <Text style={styles.text}>
        Log Out
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 62,

    backgroundColor: "#FCE2E4",

    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",

    marginTop: Spacing.xs,
  },

  text: {
    marginLeft: Spacing.sm,
    ...Typography.body,
    fontWeight: "700",
    color: "#FF4D57",
  },
});