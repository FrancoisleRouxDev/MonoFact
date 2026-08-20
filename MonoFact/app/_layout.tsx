import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "@/app/context/UserContext";

export const unstable_settings = {
  anchor: '/intro',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </UserProvider>
    </GestureHandlerRootView>
  );
}