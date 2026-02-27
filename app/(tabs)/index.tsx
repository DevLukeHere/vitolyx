import { ScrollView, View, Pressable, Text, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/atoms/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { HealthMetricCard } from '@/components/molecules/health-metric-card';
import { LatestResultCard } from '@/components/molecules/latest-result-card';
import { DailyTipCard } from '@/components/molecules/daily-tip-card';
import { useDashboard } from '@/hooks/use-dashboard';
import { Palette } from '@/constants/theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, loading, refetch } = useDashboard();

  useFocusEffect(refetch);

  const markers = data?.markersWithLatest ?? [];
  const withResults = markers.filter((m) => m.latestResult);
  const normalCount = withResults.filter((m) => m.latestResult?.flag === 'normal').length;
  const healthScore =
    withResults.length > 0 ? Math.round((normalCount / withResults.length) * 100) : 0;
  const latestSession = data?.recentSessions[0];

  return (
    <View className="flex-1 bg-surface-light dark:bg-surface-dark">
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-gunmetal/30 dark:bg-cloud/10 items-center justify-center">
              <IconSymbol name="person.fill" size={24} color={Palette.cloud} />
            </View>
            <View>
              <ThemedText variant="label">{getGreeting()}</ThemedText>
              <ThemedText variant="title" className="text-xl">
                Vitolyx
              </ThemedText>
            </View>
          </View>
          <Pressable className="w-10 h-10 rounded-full bg-gunmetal/20 dark:bg-cloud/5 items-center justify-center">
            <IconSymbol name="bell.fill" size={20} color="#888B90" />
          </Pressable>
        </View>

        {loading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color={Palette.teal} />
          </View>
        ) : (
          <>
            {latestSession && (
              <LatestResultCard
                session={latestSession}
                healthScore={healthScore}
                onPress={() => router.push(`/session/${latestSession.id}`)}
              />
            )}

            <Pressable
              onPress={() => router.push('/session/new')}
              className="mx-4 mb-6 flex-row items-center justify-center gap-2 bg-brand-500 active:bg-brand-600 rounded-2xl py-4"
            >
              <IconSymbol name="plus.circle.fill" size={22} color="#fff" />
              <Text className="text-white text-base font-semibold">Upload New Report</Text>
            </Pressable>

            <View className="flex-row items-center justify-between px-4 mb-4">
              <ThemedText variant="title" className="text-xl">
                Health Overview
              </ThemedText>
              <ThemedText className="text-brand-500 text-sm font-semibold">View All</ThemedText>
            </View>

            <View className="px-4 gap-3 mb-4">
              {withResults.length > 0 ? (
                withResults.map((m) => (
                  <HealthMetricCard
                    key={m.id}
                    marker={m}
                    onPress={() => router.push(`/marker/${m.id}`)}
                  />
                ))
              ) : (
                <View className="items-center justify-center py-20 gap-4">
                  <View className="w-16 h-16 rounded-2xl bg-brand-500/10 items-center justify-center">
                    <IconSymbol name="drop.fill" size={28} color={Palette.teal} />
                  </View>
                  <View className="items-center gap-1">
                    <ThemedText variant="subtitle" className="text-center">
                      No markers yet
                    </ThemedText>
                    <ThemedText variant="caption" className="text-center px-12">
                      Add a session to start tracking your blood markers
                    </ThemedText>
                  </View>
                </View>
              )}
            </View>

            <View className="px-4">
              <DailyTipCard />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
