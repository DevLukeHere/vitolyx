import { View, ActionSheetIOS, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';

import { SessionList } from '@/components/organisms/session-list';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSessions } from '@/hooks/use-sessions';
import { useAppStore } from '@/stores/app-store';
import { toSessionId } from '@/types/database';
import { Palette } from '@/constants/theme';
import { Pressable } from 'react-native';

export default function HistoryScreen() {
  const router = useRouter();
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
    if (process.env.EXPO_OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: 'Delete Session',
          message: 'This will permanently delete this session and all its results.',
          options: ['Cancel', 'Delete'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) remove(toSessionId(id));
        },
      );
    } else {
      Alert.alert('Delete Session', 'This will permanently delete this session and all its results.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => remove(toSessionId(id)) },
      ]);
    }
  };

  return (
    <View className="flex-1 bg-surface-light dark:bg-surface-dark">
      <Stack.Screen
        options={{
          title: 'History',
          headerSearchBarOptions: {
            placeholder: 'Search sessions...',
            onChangeText: (e) => setSearchQuery(e.nativeEvent.text),
            onCancelButtonPress: () => setSearchQuery(''),
            onClose: () => setSearchQuery(''),
            tintColor: Palette.teal,
          },
          headerRight: () => (
            <Pressable onPress={() => router.push('/session/new')}>
              <IconSymbol name="plus" size={22} color={Palette.teal} />
            </Pressable>
          ),
        }}
      />

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
