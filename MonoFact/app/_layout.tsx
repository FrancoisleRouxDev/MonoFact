import { Stack, useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "@/app/context/UserContext";
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/services/config';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';

function AuthGate({ children }: { children: React.ReactNode }) {
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthLoading(false);

      const inAuthGroup = segments[0] === 'auth';
      const inIntro = segments[0] === 'intro';

      if (user) {
        // User is logged in: if they are on intro or auth screens, redirect to tabs
        if (inAuthGroup || inIntro || !segments[0]) {
          router.replace('/(tabs)');
        }
      } else {
        // User is not logged in: redirect to intro if trying to access protected screens
        if (!inAuthGroup && !inIntro) {
          router.replace('/intro');
        }
      }
    });

    return () => unsubscribe();
  }, [segments]);

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

export const unstable_settings = {
  anchor: '/intro',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <AuthGate>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </AuthGate>
      </UserProvider>
    </GestureHandlerRootView>
  );
}