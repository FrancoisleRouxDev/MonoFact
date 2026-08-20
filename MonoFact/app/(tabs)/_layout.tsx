import { Tabs } from "expo-router";
import React from "react";

// ---------------------------------------------------------------------------
// TabLayout (file: app/(tabs)/_layout.tsx)
// ---------------------------------------------------------------------------
// Defines the tab routes for the main navigation stack.
// The default tab bar is hidden (`tabBarStyle: { display: "none" }`)
// because MonoFact uses a custom `<BottomNav />` component on each screen
// with custom styling and haptics.
// ---------------------------------------------------------------------------
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: "none",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          title: "Play",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
