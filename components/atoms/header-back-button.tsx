import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette } from '@/constants/theme';

export function HeaderBackButton() {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.back()} hitSlop={8}>
      <IconSymbol name="chevron.left" size={22} color={Palette.teal} />
    </Pressable>
  );
}
