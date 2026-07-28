import { Pressable, StyleSheet, Text } from "react-native";
import { LogOut } from "lucide-react-native";

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
        color="#555"
      />

      <Text style={styles.text}>
        Log Out
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 60,

    backgroundColor: "#D9D9D9",

    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",

    marginTop: 10,
  },

  text: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#555",
  },
});