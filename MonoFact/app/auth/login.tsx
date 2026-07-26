import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

import AppLogo from "@/components/AppLogo";
import InputField from "@/components/InputField";
import PrimaryButton from "@/components/Primary-Button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <AppLogo size={100} />

        <Text style={styles.title}>Welcome Back</Text>

        <Text style={styles.subtitle}>
          Sign in to continue your learning streak.
        </Text>

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

        <Pressable>
          <Text style={styles.link}>
            Forgot Password?
          </Text>
        </Pressable>

        <PrimaryButton
          title="Log In"
          onPress={() => {
            router.replace("/(tabs)");
          }}
        />

        <Pressable
          onPress={() => router.push("/auth/register")}
        >
          <Text style={styles.createAccount}>
            Create Account
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
    alignSelf: "flex-end",
    marginBottom: 25,
    color: "white",
  },

  createAccount: {
    textAlign: "center",
    marginTop: 25,
    color: "white",
    fontWeight: "600",
  },
});