import { View, Text, StyleSheet } from "react-native";
import { Lightbulb } from "lucide-react-native";
import { Colors } from "@/constants/Colors";


export default function SwipeHint() {
  return (
    <View style={styles.container}>

      <View style={styles.iconBox}>
        <Lightbulb
          size={24}
          color="#222"
        />
      </View>

      <Text style={styles.text}>
        Swipe to judge this statement
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F5FA",
    borderRadius: 20,
    padding: 16,
    marginTop: 30,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#E8ECF5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  text: {
    flex: 1,
    fontSize: 16,
    color: "#8A8F9C",
  },
});