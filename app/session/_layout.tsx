import { Stack } from 'expo-router';
import { Palette } from '@/constants/theme';

export default function SessionLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: 'systemMaterial',
        headerShadowVisible: false,
        headerTintColor: Palette.teal,
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
      }}
    >
      <Stack.Screen name="new" options={{ title: 'New Session' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
