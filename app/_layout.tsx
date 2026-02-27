import '../global.css';

import { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import * as SystemUI from 'expo-system-ui';
import { DatabaseProvider } from '@/lib/database/provider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Palette } from '@/constants/theme';
import { themedStackScreenOptions } from '@/lib/utils/screen-options';

const VitoluxDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Palette.charcoal,
    card: Palette.charcoal,
    text: Palette.cloud,
    border: Palette.gunmetal,
    primary: Palette.teal,
    notification: Palette.teal,
  },
};

const VitoluxLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Palette.cloud,
    card: Palette.cloud,
    text: Palette.charcoal,
    border: '#DDDDDD',
    primary: Palette.teal,
    notification: Palette.teal,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

function LoadingFallback() {
  return (
    <View className="flex-1 items-center justify-center bg-surface-dark">
      <ActivityIndicator size="large" color={Palette.teal} />
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const bg = colorScheme === 'dark' ? Palette.charcoal : Palette.cloud;
  SystemUI.setBackgroundColorAsync(bg);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? VitoluxDark : VitoluxLight}>
      <Suspense fallback={<LoadingFallback />}>
        <DatabaseProvider>
          <Stack screenOptions={themedStackScreenOptions(colorScheme)}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="session" options={{ headerShown: false }} />
            <Stack.Screen name="marker" options={{ headerShown: false }} />
          </Stack>
        </DatabaseProvider>
      </Suspense>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
