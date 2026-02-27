import { ScrollView, View, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/atoms/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CategoryFilter } from '@/components/organisms/category-filter';
import { MarkerSummaryList } from '@/components/organisms/marker-summary-list';
import { SessionCard } from '@/components/molecules/session-card';
import { useDashboard } from '@/hooks/use-dashboard';
import { useAppStore } from '@/stores/app-store';
import { Palette } from '@/constants/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, loading } = useDashboard();
  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory);

  const filteredMarkers = data?.markersWithLatest.filter((m) =>
    selectedCategory ? m.category === selectedCategory : true,
  ) ?? [];

  return (
    <View className="flex-1 bg-surface-light dark:bg-surface-dark">
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 mb-6 flex-row items-center justify-between">
          <View>
            <ThemedText variant="caption" className="text-xs mb-0.5">Welcome to</ThemedText>
            <ThemedText variant="title" className="text-3xl">Vitolyx</ThemedText>
          </View>
          <Pressable
            onPress={() => router.push('/session/new')}
            className="w-12 h-12 rounded-2xl bg-brand-500 items-center justify-center"
          >
            <IconSymbol name="plus" size={24} color="#fff" />
          </Pressable>
        </View>

        {loading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color={Palette.teal} />
          </View>
        ) : (
          <>
            <View className="mb-5">
              <CategoryFilter
                selected={selectedCategory}
                onChange={setSelectedCategory}
              />
            </View>

            <View className="mb-6">
              <MarkerSummaryList
                markers={filteredMarkers}
                onMarkerPress={(id) => router.push(`/marker/${id}`)}
              />
            </View>

            {data && data.recentSessions.length > 0 && (
              <View className="gap-3">
                <ThemedText variant="label" className="px-4">
                  Recent Sessions
                </ThemedText>
                <View className="px-4 gap-3">
                  {data.recentSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onPress={() => router.push(`/session/${session.id}`)}
                    />
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
