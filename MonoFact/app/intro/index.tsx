import { SafeAreaView, View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function IntroductionScreen() {
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.content}>

        <View style={styles.logo}>
          <Text style={styles.logoText}>M</Text>
        </View>

        <Text style={styles.title}>MonoFact</Text>

        <Text style={styles.subtitle}>
          Learn the Truth, One Swipe at a Time.
        </Text>

        <View style={styles.pagination}>
          <View style={styles.activeDot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

      </View>

      <Pressable style={styles.button} onPress={() => router.push("/(tabs)")}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8A8A8A",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#A0A0A0",
    justifyContent: "center",
    alignItems: "center", 
    marginBottom: 20,
  },
  logoText: {
    color: "white",
    fontSize: 40,
    fontWeight: 700,

  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    marginBottom: 40,
  },
  pagination: {
    flexDirection: "row",
    gap: 8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C8C8C8",
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "white",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#8A8A8A",

  },
});