import { Palette } from '@/constants/theme';

export function themedStackScreenOptions(colorScheme: string | null | undefined) {
  const bg = colorScheme === 'dark' ? Palette.charcoal : Palette.cloud;
  return {
    headerShadowVisible: false,
    headerTintColor: Palette.teal,
    headerTitleStyle: { fontWeight: '600' as const, fontSize: 17 },
    headerStyle: { backgroundColor: bg },
    contentStyle: { backgroundColor: bg },
  };
}
