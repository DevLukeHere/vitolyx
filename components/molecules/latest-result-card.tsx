import { View, Pressable } from 'react-native';
import { ThemedText } from '@/components/atoms/themed-text';
import { GlassCard } from '@/components/atoms/glass-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatSessionDate } from '@/lib/utils/date';
import type { SessionWithCount } from '@/types/database';

type Props = {
  session: SessionWithCount;
  healthScore: number;
  onPress?: () => void;
};

function getHealthLabel(score: number): string {
  if (score >= 80) return 'Overall Healthy';
  if (score >= 60) return 'Needs Attention';
  return 'At Risk';
}

export function LatestResultCard({ session, healthScore, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="px-4 mb-4">
      <GlassCard className="p-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-1.5 bg-brand-500/15 px-2.5 py-1 rounded-full">
            <View className="w-2 h-2 rounded-full bg-emerald-400" />
            <ThemedText className="text-brand-500 text-xs font-semibold">
              Latest Results
            </ThemedText>
          </View>
          <IconSymbol name="chevron.right" size={16} color="#888B90" />
        </View>

        <ThemedText variant="title" className="text-lg mb-0.5">
          {formatSessionDate(session.date)}
        </ThemedText>
        <ThemedText variant="caption" className="mb-4">
          {session.resultCount} marker{session.resultCount !== 1 ? 's' : ''}
          {session.labName ? ` · ${session.labName}` : ''}
        </ThemedText>

        <View className="h-2 rounded-full bg-gunmetal/20 dark:bg-cloud/10 mb-2 overflow-hidden">
          <View
            className="h-full rounded-full bg-brand-500"
            style={{ width: `${Math.min(healthScore, 100)}%` }}
          />
        </View>

        <View className="flex-row items-center justify-between">
          <ThemedText variant="body" className="text-sm">
            {getHealthLabel(healthScore)}
          </ThemedText>
          <ThemedText variant="caption" className="text-sm">
            {healthScore}% Score
          </ThemedText>
        </View>
      </GlassCard>
    </Pressable>
  );
}
