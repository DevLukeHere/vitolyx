import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Palette } from '@/constants/theme';

export default function MarkerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: Palette.teal,
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        headerStyle: { backgroundColor: colorScheme === 'dark' ? Palette.charcoal : Palette.cloud },
        contentStyle: { backgroundColor: colorScheme === 'dark' ? Palette.charcoal : Palette.cloud },
      }}
    >
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
