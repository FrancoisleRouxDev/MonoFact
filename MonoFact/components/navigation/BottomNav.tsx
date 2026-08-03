import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    paddingBottom: insets.bottom,
                },
            ]}
        >

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
    backgroundColor: Colors.surface,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 12,
    shadowColor: "#000",
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: -4,
    },
  },
});