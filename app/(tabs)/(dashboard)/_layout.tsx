import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { themedStackScreenOptions } from '@/lib/utils/screen-options';

export default function DashboardLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack screenOptions={themedStackScreenOptions(colorScheme)}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="session/new" options={{ title: 'New Session' }} />
      <Stack.Screen name="session/[id]" options={{ title: '' }} />
      <Stack.Screen name="marker/[id]" options={{ title: '' }} />
    </Stack>
  );
}
