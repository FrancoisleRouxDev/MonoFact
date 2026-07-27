import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import BottomNavItem from "./BottomNavItem";

import {
  House,
  CircleDot,
  User,
  ChartColumn,
  Settings,
} from "lucide-react-native";

type BottomNavProps = {
  current:
    | "home"
    | "play"
    | "profile"
    | "stats"
    | "settings";
};

export default function BottomNav({
  current,
}: BottomNavProps) {

  const router = useRouter();

  return (
    <View style={styles.container}>

    <BottomNavItem
        label="Home"
        icon={House}
        active={current === "home"}
        onPress={() => router.push("/(tabs)")}
    />

    <BottomNavItem
        label="Play"
        icon={CircleDot}
        active={current === "play"}
        onPress={() => router.push("/(tabs)/play")}
    />

    <BottomNavItem
        label="Profile"
        icon={User}
        active={current === "profile"}
        onPress={() => router.push("/(tabs)/profile")}
    />

    <BottomNavItem
        label="Stats"
        icon={ChartColumn}
        active={current === "stats"}
        onPress={() => router.push("/(tabs)/stats")}
    />

    <BottomNavItem
        label="Settings"
        icon={Settings}
        active={current === "settings"}
        onPress={() => router.push("/(tabs)/settings")}
    />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    justifyContent: "space-around",

    alignItems: "center",

    backgroundColor: "#FFFFFF",

    paddingVertical: 12,

    borderTopLeftRadius: 30,

    borderTopRightRadius: 30,

    elevation: 12,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 10,
  },
});