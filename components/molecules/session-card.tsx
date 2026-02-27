import { Pressable, View } from 'react-native';
import { ThemedText } from '@/components/atoms/themed-text';
import { GlassCard } from '@/components/atoms/glass-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatSessionDate } from '@/lib/utils/date';
import type { SessionWithCount } from '@/types/database';
import { Palette } from '@/constants/theme';

type SessionCardProps = {
  session: SessionWithCount;
  onPress: () => void;
  onDelete?: () => void;
};

export function SessionCard({ session, onPress, onDelete }: SessionCardProps) {
  return (
    <Pressable onPress={onPress}>
      <GlassCard className="p-4 flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-xl bg-brand-500/10 items-center justify-center">
          <IconSymbol name="drop.fill" size={18} color={Palette.teal} />
        </View>

        <View className="flex-1 gap-0.5">
          <ThemedText variant="subtitle" className="text-base">
            {formatSessionDate(session.date)}
          </ThemedText>
          <ThemedText variant="caption">
            {session.resultCount} marker{session.resultCount !== 1 ? 's' : ''}
            {session.labName ? ` · ${session.labName}` : ''}
          </ThemedText>
        </View>

        {onDelete && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2"
            hitSlop={8}
          >
            <IconSymbol name="trash.fill" size={16} color="#ef4444" />
          </Pressable>
        )}

        <IconSymbol name="chevron.right" size={14} color="#888B90" />
      </GlassCard>
    </Pressable>
  );
}
