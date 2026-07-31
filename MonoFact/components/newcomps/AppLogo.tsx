import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

type AppLogoProps = {
  size?: number;
};

export default function AppLogo({
  size = 70,
}: AppLogoProps) {
  return (
    <View
      style={[
        styles.logo,
        {
          width: size,
          height: size,
          borderRadius: size * 0.24,
        },
      ]}
    >
      <Text
        style={[
          styles.logoText,
          {
            fontSize: size * 0.52,
          },
        ]}
      >
        M
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 4,
  },

  logoText: {
    color: Colors.surface,
    fontWeight: "700",
  },
});