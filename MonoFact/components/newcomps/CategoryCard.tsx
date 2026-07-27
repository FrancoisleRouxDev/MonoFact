import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CategoryCardProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export default function CategoryCard({
  icon,
  title,
  onPress,
}: CategoryCardProps) {
        return (
            <Pressable
                style={styles.card}
                onPress={onPress}
            >
                <Ionicons
                    name={icon}
                    size={40}
                    color="#FFF"
                />

                <Text style={styles.title}>
                    {title}
                </Text>
            </Pressable>
        );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 100,
    backgroundColor: "#707070",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,

  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
});