import { useState } from "react";
import {
  SafeAreaView,
  View,
 Text,
  Pressable,
  StyleSheet,
} from "react-native";

import AppLogo from "@/components/newcomps/AppLogo";
import PrimaryButton from "@/components/newcomps/Primary-Button";
import InputField from "@/components/newcomps/InputField";
import { router, useRouter } from "expo-router";

export default function RegisterScreen() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <AppLogo size={100} />

        <Text style={styles.title}>
          Create Account
        </Text>

        <Text style={styles.subtitle}>
          Join thousands of fact-checkers.
        </Text>

        <InputField
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <InputField
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
        />

        <InputField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <InputField
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <PrimaryButton
          title="Create Account"
          onPress={() => {
            // Firebase later
          router.push("/(tabs)")
          }}
        />

        <Pressable>
          <Text style={styles.link} onPress={() => router.push("/auth/login")}>
            Already have an account? Log In
          </Text>
        </Pressable>

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
    paddingHorizontal: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "white",
    marginTop: 30,
  },

  subtitle: {
    color: "white",
    marginBottom: 30,
  },

  link: {
    marginTop: 25,
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
});