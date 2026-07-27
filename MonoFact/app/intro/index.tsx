import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// Components
import PrimaryButton from "@/components/buttons/Primary-Button";
import AppLogo from "@/components/newcomps/AppLogo";
import PaginationDots from "@/components/ui/PaginationDots";


export default function IntroductionScreen() {

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.content}>

      <AppLogo size={100}/>

        <Text style={styles.title}>MonoFact</Text>

        <Text style={styles.subtitle}>
          Learn the Truth, One Swipe at a Time.
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

  // Dots styling
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

  // Button styling
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
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  }
});