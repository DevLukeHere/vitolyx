import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/atoms/themed-text';
import { PrimaryButton } from '@/components/atoms/primary-button';
import { StyledInput } from '@/components/atoms/text-input';
import { SessionList } from '@/components/organisms/session-list';
import { useSessions } from '@/hooks/use-sessions';
import { useAppStore } from '@/stores/app-store';
import { toSessionId } from '@/types/database';

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: sessions, loading, refetch, remove } = useSessions();
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);

  const filtered = sessions?.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.date.includes(q) ||
      s.labName?.toLowerCase().includes(q) ||
      s.notes?.toLowerCase().includes(q)
    );
  }) ?? [];

  const handleDelete = (id: string) => {
    Alert.alert('Delete Session', 'This will permanently delete this session and all its results.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => remove(toSessionId(id)),
      },
    ]);
  };

  return (
    <View
      className="flex-1 bg-surface-light dark:bg-surface-dark"
      style={{ paddingTop: insets.top + 12 }}
    >
      <View className="px-4 mb-4 flex-row items-center justify-between">
        <ThemedText variant="title">History</ThemedText>
        <PrimaryButton
          label="Add"
          variant="ghost"
          onPress={() => router.push('/session/new')}
          className="px-3 py-2"
        />
      </View>

      <View className="px-4 mb-3">
        <StyledInput
          placeholder="Search sessions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <SessionList
        sessions={filtered}
        onPress={(id) => router.push(`/session/${id}`)}
        onDelete={handleDelete}
        onRefresh={refetch}
        refreshing={loading}
      />
    </View>
  );
}
