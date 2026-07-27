import { View, Text, StyleSheet } from "react-native";

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
          borderRadius: size * 0.28,
        },
      ]}
    >
      <Text
        style={[
          styles.logoText,
          {
            fontSize: size * 0.55,
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
    backgroundColor: "#A0A0A0",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    color: "white",
    fontWeight: "700",
  },
});