import { View } from 'react-native';
import { ThemedText } from '@/components/atoms/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette } from '@/constants/theme';

type Props = { icon: string; title: string; subtitle: string };

export function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <View className="items-center justify-center py-20 gap-4">
      <View className="w-16 h-16 rounded-2xl bg-brand-500/10 items-center justify-center">
        <IconSymbol name={icon as any} size={28} color={Palette.teal} />
      </View>
      <View className="items-center gap-1">
        <ThemedText variant="subtitle" className="text-center">
          {title}
        </ThemedText>
        <ThemedText variant="caption" className="text-center px-12">
          {subtitle}
        </ThemedText>
      </View>
    </View>
  );
}
