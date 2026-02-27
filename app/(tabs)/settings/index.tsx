import { View, ScrollView, Alert, ActionSheetIOS, Switch } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { Stack } from 'expo-router';

import { ThemedText } from '@/components/atoms/themed-text';
import { PrimaryButton } from '@/components/atoms/primary-button';
import { GlassCard } from '@/components/atoms/glass-card';
import { useSettings } from '@/hooks/use-settings';
import { useSessions } from '@/hooks/use-sessions';
import { createResultRepository } from '@/lib/repositories/result-repository';
import { createMarkerRepository } from '@/lib/repositories/marker-repository';
import { Palette } from '@/constants/theme';

export default function SettingsScreen() {
  const db = useSQLiteContext();
  const { data: settings, setSetting } = useSettings();
  const { data: sessions } = useSessions();

  const handleExport = async () => {
    try {
      const { exportToJson } = await import('@/lib/utils/export');
      const resultRepo = createResultRepository(db);
      const markerRepo = createMarkerRepository(db);

      const allResults = [];
      for (const session of sessions ?? []) {
        const results = await resultRepo.getBySession(session.id);
        allResults.push(...results);
      }
      const markers = await markerRepo.getAll();
      await exportToJson(sessions ?? [], allResults, markers);
    } catch (e) {
      Alert.alert('Export failed', String(e));
    }
  };

  const handleClearData = () => {
    if (process.env.EXPO_OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: 'Clear All Data',
          message: 'This will permanently delete all sessions and results. This cannot be undone.',
          options: ['Cancel', 'Clear All Data'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            db.execAsync('DELETE FROM test_results').then(() =>
              db.execAsync('DELETE FROM test_sessions')
            );
          }
        },
      );
    } else {
      Alert.alert(
        'Clear All Data',
        'This will permanently delete all sessions and results. This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: async () => {
              await db.execAsync('DELETE FROM test_results');
              await db.execAsync('DELETE FROM test_sessions');
            },
          },
        ],
      );
    }
  };

  const unitPreference = settings?.unitPreference ?? 'metric';
  const isImperial = unitPreference === 'imperial';

  return (
    <View className="flex-1 bg-surface-light dark:bg-surface-dark">
      <Stack.Screen options={{ title: 'Settings' }} />

      <ScrollView
        contentContainerClassName="px-4 gap-6 pb-8 pt-4"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-2">
          <ThemedText variant="label" className="px-1">Units</ThemedText>
          <GlassCard className="p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 gap-0.5">
                <ThemedText variant="body">Imperial units</ThemedText>
                <ThemedText variant="caption">
                  mg/dL for cholesterol, glucose, etc.
                </ThemedText>
              </View>
              <Switch
                value={isImperial}
                onValueChange={(v) =>
                  setSetting('unitPreference', v ? 'imperial' : 'metric')
                }
                trackColor={{ true: Palette.teal, false: '#393E4660' }}
                thumbColor="#fff"
              />
            </View>
          </GlassCard>
        </View>

        <View className="gap-2">
          <ThemedText variant="label" className="px-1">Data</ThemedText>
          <GlassCard className="p-4 gap-3">
            <PrimaryButton
              label="Export as JSON"
              variant="ghost"
              onPress={handleExport}
            />
            <PrimaryButton
              label="Clear all data"
              variant="danger"
              onPress={handleClearData}
            />
          </GlassCard>
        </View>

        <View className="gap-2">
          <ThemedText variant="label" className="px-1">About</ThemedText>
          <GlassCard className="p-4 gap-1">
            <ThemedText variant="body">Vitolyx</ThemedText>
            <ThemedText variant="caption">
              v0.1.0 · Blood test results tracker
            </ThemedText>
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}
