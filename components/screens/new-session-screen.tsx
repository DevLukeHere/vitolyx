import { useState } from 'react';
import { ScrollView, View, Pressable, Alert, KeyboardAvoidingView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/atoms/themed-text';
import { PrimaryButton } from '@/components/atoms/primary-button';
import { StyledInput } from '@/components/atoms/text-input';
import { GlassCard } from '@/components/atoms/glass-card';
import { HeaderBackButton } from '@/components/atoms/header-back-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CategoryFilter } from '@/components/organisms/category-filter';
import { FlagBadge } from '@/components/atoms/badge';
import { useMarkers } from '@/hooks/use-markers';
import { useSessions } from '@/hooks/use-sessions';
import { useSettings } from '@/hooks/use-settings';
import { createResultRepository } from '@/lib/repositories/result-repository';
import { todayDate } from '@/lib/utils/date';
import { computeFlag } from '@/lib/utils/units';
import { useSQLiteContext } from 'expo-sqlite';
import type { BloodMarker, MarkerCategory } from '@/types/database';
import { toMarkerId, toSessionId } from '@/types/database';
import { cn } from '@/lib/utils/cn';

const STEPS = ['Details', 'Markers', 'Values', 'Review'] as const;

const formSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format'),
  labName: z.string().optional(),
  notes: z.string().optional(),
  results: z.array(
    z.object({
      markerId: z.string(),
      markerName: z.string(),
      value: z.string().min(1, 'Required').refine(
        (v) => !isNaN(parseFloat(v)) && isFinite(Number(v)),
        'Must be a number',
      ),
      unit: z.string(),
    }),
  ).min(1, 'Add at least one result'),
});

type FormData = z.infer<typeof formSchema>;

function StepBar({ current }: { current: number }) {
  return (
    <View className="flex-row items-center gap-1.5 px-4 py-3">
      {STEPS.map((label, i) => (
        <View key={label} className="flex-1 items-center gap-1.5">
          <View
            className={cn(
              'h-1 w-full rounded-full',
              i <= current ? 'bg-brand-500' : 'bg-gunmetal/20 dark:bg-cloud/10',
            )}
          />
          <ThemedText
            variant="caption"
            className={cn(
              'text-[10px]',
              i === current && 'text-brand-500 font-semibold',
            )}
          >
            {label}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

export default function NewSessionScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(0);
  const [filterCategory, setFilterCategory] = useState<MarkerCategory | null>(null);
  const [selectedMarkerIds, setSelectedMarkerIds] = useState<Set<string>>(new Set());
  const [markerSearch, setMarkerSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: markers } = useMarkers(filterCategory ?? undefined);
  const { data: settings } = useSettings();
  const { create: createSession } = useSessions();
  const preference = settings?.unitPreference ?? 'metric';

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: todayDate(),
      labName: '',
      notes: '',
      results: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'results' });
  const watchResults = watch('results');

  const filteredMarkers = markers?.filter((m) => {
    if (!markerSearch) return true;
    const q = markerSearch.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.shortName.toLowerCase().includes(q);
  }) ?? [];

  const toggleMarker = (marker: BloodMarker) => {
    const id = marker.id as string;
    const next = new Set(selectedMarkerIds);
    if (next.has(id)) {
      next.delete(id);
      const idx = fields.findIndex((f) => f.markerId === id);
      if (idx >= 0) remove(idx);
    } else {
      next.add(id);
      const unit = preference === 'imperial' && marker.altUnit ? marker.altUnit : marker.defaultUnit;
      append({ markerId: id, markerName: marker.name, value: '', unit });
    }
    setSelectedMarkerIds(next);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true;
      case 1: return selectedMarkerIds.size > 0;
      case 2: return true;
      default: return false;
    }
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const session = await createSession({
        date: data.date,
        labName: data.labName || undefined,
        notes: data.notes || undefined,
      });

      const resultRepo = createResultRepository(db);
      const inputs = data.results
        .filter((r) => r.value.trim() !== '')
        .map((r) => {
          const marker = markers?.find((m) => (m.id as string) === r.markerId);
          let value = parseFloat(r.value);
          let unit = r.unit;
          if (marker && preference === 'imperial' && marker.altUnit && marker.conversionFactor !== null) {
            value = value / marker.conversionFactor;
            unit = marker.defaultUnit;
          }
          return { markerId: toMarkerId(r.markerId), value, unit };
        });

      await resultRepo.createMany(toSessionId(session.id as string), inputs);
      router.back();
    } catch (e) {
      Alert.alert('Error', String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'New Session',
          headerLeft: () => <HeaderBackButton />,
        }}
      />
      <KeyboardAvoidingView
        className="flex-1 bg-surface-light dark:bg-surface-dark"
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
      >
        <StepBar current={step} />

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pb-8 gap-4"
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 && (
            <View className="gap-4">
              <Controller
                control={control}
                name="date"
                render={({ field: { onChange, value } }) => (
                  <StyledInput
                    label="Date"
                    placeholder="YYYY-MM-DD"
                    value={value}
                    onChangeText={onChange}
                    error={errors.date?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="labName"
                render={({ field: { onChange, value } }) => (
                  <StyledInput
                    label="Lab Name"
                    placeholder="e.g. Quest Diagnostics"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                  <StyledInput
                    label="Notes"
                    placeholder="Any additional notes..."
                    value={value}
                    onChangeText={onChange}
                    multiline
                  />
                )}
              />
            </View>
          )}

          {step === 1 && (
            <View className="gap-4">
              <StyledInput
                placeholder="Search markers..."
                value={markerSearch}
                onChangeText={setMarkerSearch}
              />
              <CategoryFilter
                selected={filterCategory}
                onChange={setFilterCategory}
              />
              <View className="gap-2">
                {filteredMarkers.map((marker) => {
                  const isSelected = selectedMarkerIds.has(marker.id as string);
                  return (
                    <Pressable
                      key={marker.id}
                      onPress={() => toggleMarker(marker)}
                    >
                      <View
                        className={cn(
                          'p-3.5 flex-row items-center rounded-xl border',
                          isSelected
                            ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10'
                            : 'border-gunmetal/15 dark:border-cloud/10 bg-white dark:bg-white/5',
                        )}
                      >
                        <View
                          className={cn(
                            'w-5 h-5 rounded-md border-2 items-center justify-center mr-3',
                            isSelected
                              ? 'bg-brand-500 border-brand-500'
                              : 'border-gunmetal/30 dark:border-cloud/20',
                          )}
                        >
                          {isSelected && (
                            <IconSymbol name="checkmark" size={12} color="#fff" />
                          )}
                        </View>
                        <View className="flex-1">
                          <ThemedText variant="body" className="text-sm font-medium">
                            {marker.name}
                          </ThemedText>
                          <ThemedText variant="caption" className="text-xs">
                            {marker.shortName} · {marker.defaultUnit}
                          </ThemedText>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {step === 2 && (
            <View className="gap-3">
              {fields.map((field, index) => {
                const marker = markers?.find(
                  (m) => (m.id as string) === field.markerId,
                );
                return (
                  <GlassCard key={field.id} className="p-4 gap-3">
                    <View className="flex-row items-center justify-between">
                      <ThemedText variant="body" className="text-sm font-medium">
                        {field.markerName}
                      </ThemedText>
                      <ThemedText variant="caption" className="text-xs">
                        {field.unit}
                      </ThemedText>
                    </View>
                    <Controller
                      control={control}
                      name={`results.${index}.value`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <StyledInput
                          placeholder={marker ? `${marker.referenceLow}–${marker.referenceHigh}` : ''}
                          keyboardType="decimal-pad"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          error={(errors.results as any)?.[index]?.value?.message}
                        />
                      )}
                    />
                  </GlassCard>
                );
              })}
            </View>
          )}

          {step === 3 && (
            <View className="gap-4">
              <GlassCard className="p-5 gap-3">
                <ThemedText variant="label">Session</ThemedText>
                <View className="gap-1">
                  <ThemedText variant="subtitle" className="text-base">
                    {watch('date')}
                  </ThemedText>
                  {watch('labName') ? (
                    <ThemedText variant="caption">Lab: {watch('labName')}</ThemedText>
                  ) : null}
                  {watch('notes') ? (
                    <ThemedText variant="caption">{watch('notes')}</ThemedText>
                  ) : null}
                </View>
              </GlassCard>

              <GlassCard className="p-5 gap-3">
                <ThemedText variant="label">
                  Results ({watchResults.filter((r) => r.value.trim() !== '').length})
                </ThemedText>
                {watchResults.map((r, i) => {
                  if (r.value.trim() === '') return null;
                  const marker = markers?.find((m) => (m.id as string) === r.markerId);
                  const numValue = parseFloat(r.value);
                  const flag = marker && !isNaN(numValue)
                    ? computeFlag(numValue, r.unit, marker)
                    : null;
                  return (
                    <View key={i} className="flex-row items-center justify-between py-1.5 border-b border-gunmetal/10 dark:border-cloud/5">
                      <ThemedText variant="body" className="text-sm flex-1">
                        {r.markerName}
                      </ThemedText>
                      <View className="flex-row items-center gap-2">
                        <ThemedText variant="mono" className="text-sm">
                          {r.value} {r.unit}
                        </ThemedText>
                        {flag && <FlagBadge flag={flag} />}
                      </View>
                    </View>
                  );
                })}
              </GlassCard>
            </View>
          )}
        </ScrollView>

        <View
          className="px-4 pt-3 border-t border-gunmetal/10 dark:border-cloud/5"
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        >
          <View className="flex-row gap-3">
            {step > 0 && (
              <PrimaryButton
                label="Back"
                variant="ghost"
                onPress={() => setStep((s) => s - 1)}
                className="flex-1"
              />
            )}
            {step < 3 ? (
              <PrimaryButton
                label="Next"
                onPress={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="flex-1"
              />
            ) : (
              <PrimaryButton
                label="Save Session"
                loading={saving}
                onPress={handleSubmit(onSubmit)}
                className="flex-1"
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
