import { View } from 'react-native';
import { ThemedText } from '@/components/atoms/themed-text';
import { GlassCard } from '@/components/atoms/glass-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette } from '@/constants/theme';

const TIPS = [
  'Hydration improves blood test accuracy. Drink water!',
  'Fasting 8-12 hours before lipid tests improves accuracy.',
  'Regular exercise can help improve cholesterol levels.',
  'Stress can temporarily affect blood sugar readings.',
  'Consistency in testing time helps track trends accurately.',
  'Sleep quality can influence hormone and glucose levels.',
  'Avoid alcohol 24 hours before blood tests for best results.',
];

export function DailyTipCard() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const tip = TIPS[dayOfYear % TIPS.length];

  return (
    <GlassCard className="p-5">
      <View className="flex-row items-center gap-3 mb-2">
        <View className="w-10 h-10 rounded-full bg-brand-500/15 items-center justify-center">
          <IconSymbol name="lightbulb.fill" size={18} color={Palette.teal} />
        </View>
        <ThemedText variant="subtitle" className="text-base">
          Daily Tip
        </ThemedText>
      </View>
      <ThemedText variant="caption" className="text-sm leading-5">
        {tip}
      </ThemedText>
    </GlassCard>
  );
}
