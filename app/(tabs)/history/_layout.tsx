import { Stack } from 'expo-router';
import { Palette } from '@/constants/theme';

export default function HistoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerTintColor: Palette.teal,
      }}
    />
  );
}
