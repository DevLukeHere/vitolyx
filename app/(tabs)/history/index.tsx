import { useState, useMemo } from 'react';
import { View, ActionSheetIOS, Alert } from 'react-native';
import { useRouter, useFocusEffect, Stack } from 'expo-router';
import { subMonths, parseISO } from 'date-fns';

import { SessionList } from '@/components/organisms/session-list';
import { TimeRangeFilter, type TimeRange } from '@/components/molecules/time-range-filter';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSessions } from '@/hooks/use-sessions';
import { useAppStore } from '@/stores/app-store';
import { toSessionId } from '@/types/database';
import { Palette } from '@/constants/theme';
import { Pressable } from 'react-native';

export default function HistoryScreen() {
  const router = useRouter();
  const { data: sessions, loading, refetch, remove } = useSessions();
  const [range, setRange] = useState<TimeRange>('All');

  useFocusEffect(refetch);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);

  const filtered = useMemo(() => {
    let result = sessions ?? [];

    if (range !== 'All') {
      const months = range === '3M' ? 3 : range === '6M' ? 6 : 12;
      const cutoff = subMonths(new Date(), months);
      result = result.filter((s) => parseISO(s.date) >= cutoff);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) =>
        s.date.includes(q) ||
        s.labName?.toLowerCase().includes(q) ||
        s.notes?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [sessions, range, searchQuery]);

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

      <View className="px-4 py-3">
        <TimeRangeFilter selected={range} onChange={setRange} />
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
