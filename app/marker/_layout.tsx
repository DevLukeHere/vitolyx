import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { themedStackScreenOptions } from '@/lib/utils/screen-options';

export default function MarkerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack screenOptions={themedStackScreenOptions(colorScheme)}>
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
