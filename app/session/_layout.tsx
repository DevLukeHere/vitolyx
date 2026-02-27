import { Stack } from 'expo-router';
import { Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SessionLayout() {
  const isDark = (useColorScheme() ?? 'light') === 'dark';

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: Palette.teal,
        headerStyle: {
          backgroundColor: isDark ? Palette.charcoal : Palette.cloud,
        },
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
      }}
    >
      <Stack.Screen name="new" options={{ title: 'New Session' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
