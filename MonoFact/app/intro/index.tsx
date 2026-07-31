import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { useRouter } from "expo-router";

// Components
import PrimaryButton from "@/components/buttons/Primary-Button";
import AppLogo from "@/components/newcomps/AppLogo";
import PaginationDots from "@/components/ui/PaginationDots";


export default function IntroductionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>

      <View pointerEvents="none" style={styles.backgroundGlow} />

      <View style={styles.content}>

        <AppLogo size={96} />

        <Text style={styles.title}>MonoFact</Text>

        <Text style={styles.subtitle}>
          Learn the truth, one swipe at a time.
        </Text>

        <PaginationDots
          total={3}
          active={0}
        />

      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Get Started"
          onPress={() => {
            router.push('/auth/login');
          }}
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  backgroundGlow: {
    position: "absolute",
    top: -140,
    left: -120,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "rgba(69, 123, 157, 0.22)",
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 88,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.surface,
    marginTop: Spacing.lg,
  },
  subtitle: {
    ...Typography.caption,
    color: "rgba(255, 255, 255, 0.72)",
    textAlign: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    lineHeight: 20,
    maxWidth: 240,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
});