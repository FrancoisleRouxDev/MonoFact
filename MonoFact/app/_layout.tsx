import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { GestureHandlerRootView } from "react-native-gesture-handler";


import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '/intro',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack 
        screenOptions={{
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}