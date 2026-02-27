import { FlatList } from 'react-native';
import { SessionCard } from '@/components/molecules/session-card';
import { EmptyState } from '@/components/atoms/empty-state';
import type { SessionWithCount } from '@/types/database';

type SessionListProps = {
  sessions: SessionWithCount[];
  onPress: (id: string) => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
};

export function SessionList({ sessions, onPress, onDelete, onRefresh, refreshing }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="No sessions yet"
        subtitle="Tap + to record your first blood test"
      />
    );
  }

  return (
    <FlatList
      data={sessions}
      keyExtractor={(item) => item.id}
      contentContainerClassName="px-4 gap-3 pb-4"
      contentInsetAdjustmentBehavior="automatic"
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
