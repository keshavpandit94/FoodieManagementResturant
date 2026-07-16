import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';

import WelcomeScreen from '@/components/WelcomeScreen';
import { StoreProvider, useStore } from '../context/StoreContext';

SplashScreen.preventAutoHideAsync();

function AppEntry() {
  const { user } = useStore();

  if (!user) {
    return <WelcomeScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="inventory" />
      <Stack.Screen name="coupons" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="outlets" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="order-detail/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <StoreProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppEntry />
      </ThemeProvider>
    </StoreProvider>
  );
}
