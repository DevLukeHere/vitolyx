import { View, ScrollView, Alert, ActionSheetIOS, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';

import { ThemedText } from '@/components/atoms/themed-text';
import { GlassCard } from '@/components/atoms/glass-card';
import { FlagBadge } from '@/components/atoms/badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSession } from '@/hooks/use-sessions';
import { useSessionResults } from '@/hooks/use-results';
import { formatSessionDate } from '@/lib/utils/date';
import { formatValue } from '@/lib/utils/units';
import { toSessionId, toResultId } from '@/types/database';
import { Palette } from '@/constants/theme';

export default function SessionDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const router = useRouter();
  const sessionId = toSessionId(id);

  const { data: session, loading: sessionLoading } = useSession(sessionId);
  const { data: results, loading: resultsLoading, removeResult } = useSessionResults(sessionId);

  const handleDeleteResult = (resultId: string) => {
    if (process.env.EXPO_OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: 'Delete Result',
          message: 'Remove this result?',
          options: ['Cancel', 'Delete'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) removeResult(toResultId(resultId));
        },
      );
    } else {
      Alert.alert('Delete Result', 'Remove this result?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeResult(toResultId(resultId)) },
      ]);
    }
  };

  if (sessionLoading || resultsLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-light dark:bg-surface-dark">
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={Palette.teal} />
      </View>
    );
  }

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-light dark:bg-surface-dark">
        <Stack.Screen options={{ title: 'Not Found' }} />
        <ThemedText variant="subtitle">Session not found</ThemedText>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface-light dark:bg-surface-dark">
      <Stack.Screen
        options={{
          title: formatSessionDate(session.date),
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <IconSymbol name="chevron.left" size={22} color={Palette.teal} />
            </Pressable>
          ),
        }}
      />

      <ScrollView contentContainerClassName="px-4 py-4 gap-4" contentInsetAdjustmentBehavior="automatic">
        <GlassCard className="p-5 gap-2">
          <ThemedText variant="label">Session Info</ThemedText>
          <ThemedText variant="subtitle">
            {formatSessionDate(session.date)}
          </ThemedText>
          {session.labName && (
            <ThemedText variant="caption">Lab: {session.labName}</ThemedText>
          )}
          {session.notes && (
            <ThemedText variant="caption">{session.notes}</ThemedText>
          )}
          <ThemedText variant="caption">
            {results?.length ?? 0} result{(results?.length ?? 0) !== 1 ? 's' : ''}
          </ThemedText>
        </GlassCard>

        {results && results.length > 0 && (
          <View className="gap-3">
            <ThemedText variant="label" className="px-1">Results</ThemedText>
            {results.map((r) => (
              <Pressable
                key={r.id}
                onPress={() => router.push(`/marker/${r.markerId}`)}
              >
                <GlassCard className="p-5 flex-row items-center">
                  <View className="flex-1 gap-1">
                    <ThemedText variant="body" className="text-sm font-medium">
                      {r.marker.name}
                    </ThemedText>
                    <ThemedText variant="mono">
                      {formatValue(r.displayValue, r.displayUnit)}
                    </ThemedText>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <FlagBadge flag={r.flag} />
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteResult(r.id as string);
                      }}
                      hitSlop={8}
                      className="p-1"
                    >
                      <IconSymbol name="trash.fill" size={14} color="#ef4444" />
                    </Pressable>
                    <IconSymbol name="chevron.right" size={14} color="#888B90" />
                  </View>
                </GlassCard>
              </Pressable>
            ))}
          </View>
        )}

        {results && results.length === 0 && (
          <View className="items-center py-12">
            <ThemedText variant="caption">No results in this session</ThemedText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
