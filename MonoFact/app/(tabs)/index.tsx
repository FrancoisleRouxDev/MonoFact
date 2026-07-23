import { SafeAreaView, View, Text, Pressable, StyleSheet } from "react-native";

export default function HomeScreen() {
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

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  content: {},
  logo: {},
  logoText: {},
  title: {},
  subtitle: {},
  pagination: {},
  activeDot: {},
  dot: {},
  button: {},
  buttonText: {},
});