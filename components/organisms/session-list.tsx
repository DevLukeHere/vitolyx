import { FlatList, View } from 'react-native';
import { SessionCard } from '@/components/molecules/session-card';
import { ThemedText } from '@/components/atoms/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { SessionWithCount } from '@/types/database';
import { Palette } from '@/constants/theme';

type SessionListProps = {
  sessions: SessionWithCount[];
  onPress: (id: string) => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
};

function EmptyState() {
  return (
    <View className="items-center justify-center py-20 gap-4">
      <View className="w-16 h-16 rounded-2xl bg-brand-500/10 items-center justify-center">
        <IconSymbol name="calendar" size={28} color={Palette.teal} />
      </View>
      <View className="items-center gap-1">
        <ThemedText variant="subtitle" className="text-center">
          No sessions yet
        </ThemedText>
        <ThemedText variant="caption" className="text-center px-12">
          Tap + to record your first blood test
        </ThemedText>
      </View>
    </View>
  );
}

export function SessionList({ sessions, onPress, onDelete, onRefresh, refreshing }: SessionListProps) {
  if (sessions.length === 0) return <EmptyState />;

  return (
    <FlatList
      data={sessions}
      keyExtractor={(item) => item.id}
      contentContainerClassName="px-4 gap-3 pb-4"
      onRefresh={onRefresh}
      refreshing={refreshing ?? false}
      renderItem={({ item }) => (
        <SessionCard
          session={item}
          onPress={() => onPress(item.id)}
          onDelete={onDelete ? () => onDelete(item.id) : undefined}
        />
      )}
    />
  );
}
