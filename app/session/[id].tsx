import { useState } from 'react';
import { View, ScrollView, Alert, ActionSheetIOS, ActivityIndicator, Pressable, Modal, KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';

import { ThemedText } from '@/components/atoms/themed-text';
import { GlassCard } from '@/components/atoms/glass-card';
import { FlagBadge } from '@/components/atoms/badge';
import { HeaderBackButton } from '@/components/atoms/header-back-button';
import { PrimaryButton } from '@/components/atoms/primary-button';
import { StyledInput } from '@/components/atoms/text-input';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSession } from '@/hooks/use-sessions';
import { useSessionResults } from '@/hooks/use-results';
import { useSettings } from '@/hooks/use-settings';
import { formatSessionDate } from '@/lib/utils/date';
import { formatValue } from '@/lib/utils/units';
import { toSessionId, toResultId, type FlaggedResult } from '@/types/database';
import { Palette } from '@/constants/theme';

type EditModal = { type: 'session' } | { type: 'result'; result: FlaggedResult };

export default function SessionDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const router = useRouter();
  const sessionId = toSessionId(id);

  const { data: session, loading: sessionLoading, update: updateSession } = useSession(sessionId);
  const { data: results, loading: resultsLoading, removeResult, updateResult } = useSessionResults(sessionId);
  const { data: settings } = useSettings();
  const preference = settings?.unitPreference ?? 'metric';

  const [modal, setModal] = useState<EditModal | null>(null);
  const [saving, setSaving] = useState(false);

  // Result edit state
  const [editValue, setEditValue] = useState('');

  // Session edit state
  const [editDate, setEditDate] = useState('');
  const [editLabName, setEditLabName] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const openResultEdit = (r: FlaggedResult) => {
    setEditValue(String(r.displayValue));
    setModal({ type: 'result', result: r });
  };

  const openSessionEdit = () => {
    if (!session) return;
    setEditDate(session.date);
    setEditLabName(session.labName ?? '');
    setEditNotes(session.notes ?? '');
    setModal({ type: 'session' });
  };

  const closeModal = () => {
    setModal(null);
    setEditValue('');
  };

  const handleSaveResult = async () => {
    if (modal?.type !== 'result') return;
    const numValue = parseFloat(editValue);
    if (isNaN(numValue)) return;

    setSaving(true);
    try {
      const r = modal.result;
      let storeValue = numValue;
      let storeUnit = r.displayUnit;

      if (
        preference === 'imperial' &&
        r.marker.altUnit &&
        r.marker.conversionFactor !== null &&
        storeUnit === r.marker.altUnit
      ) {
        storeValue = numValue / r.marker.conversionFactor;
        storeUnit = r.marker.defaultUnit;
      }

      await updateResult(toResultId(r.id as string), {
        value: storeValue,
        unit: storeUnit,
      });
      closeModal();
    } catch (e) {
      Alert.alert('Error', String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSession = async () => {
    if (!editDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert('Invalid Date', 'Use YYYY-MM-DD format');
      return;
    }

    setSaving(true);
    try {
      await updateSession({
        date: editDate,
        labName: editLabName || null,
        notes: editNotes || null,
      });
      closeModal();
    } catch (e) {
      Alert.alert('Error', String(e));
    } finally {
      setSaving(false);
    }
  };

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
          headerLeft: () => <HeaderBackButton />,
          headerRight: () => (
            <Pressable onPress={openSessionEdit} hitSlop={8}>
              <IconSymbol name="pencil" size={20} color={Palette.teal} />
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
                        openResultEdit(r);
                      }}
                      hitSlop={8}
                      className="p-1"
                    >
                      <IconSymbol name="pencil" size={14} color={Palette.teal} />
                    </Pressable>
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

      {/* Edit Result Modal */}
      <Modal
        visible={modal?.type === 'result'}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          className="flex-1 justify-end"
          behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable className="flex-1" onPress={closeModal} />
          <View className="bg-cloud dark:bg-charcoal rounded-t-3xl px-5 pt-6 pb-10 gap-5 border-t border-gunmetal/10 dark:border-cloud/10">
            <View className="flex-row items-center justify-between">
              <ThemedText variant="title" className="text-lg">
                Edit Result
              </ThemedText>
              <Pressable onPress={closeModal} hitSlop={8}>
                <IconSymbol name="xmark.circle.fill" size={24} color="#888B90" />
              </Pressable>
            </View>

            {modal?.type === 'result' && (
              <>
                <View className="gap-1">
                  <ThemedText variant="subtitle" className="text-base">
                    {modal.result.marker.name}
                  </ThemedText>
                  <ThemedText variant="caption">
                    Range: {modal.result.marker.referenceLow}–{modal.result.marker.referenceHigh} {modal.result.marker.defaultUnit}
                  </ThemedText>
                </View>

                <StyledInput
                  label={`Value (${modal.result.displayUnit})`}
                  keyboardType="decimal-pad"
                  value={editValue}
                  onChangeText={setEditValue}
                  placeholder={String(modal.result.displayValue)}
                  autoFocus
                />

                <View className="flex-row gap-3">
                  <PrimaryButton
                    label="Cancel"
                    variant="ghost"
                    onPress={closeModal}
                    className="flex-1"
                  />
                  <PrimaryButton
                    label="Save"
                    loading={saving}
                    disabled={!editValue.trim() || isNaN(parseFloat(editValue))}
                    onPress={handleSaveResult}
                    className="flex-1"
                  />
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Session Modal */}
      <Modal
        visible={modal?.type === 'session'}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          className="flex-1 justify-end"
          behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable className="flex-1" onPress={closeModal} />
          <View className="bg-cloud dark:bg-charcoal rounded-t-3xl px-5 pt-6 pb-10 gap-5 border-t border-gunmetal/10 dark:border-cloud/10">
            <View className="flex-row items-center justify-between">
              <ThemedText variant="title" className="text-lg">
                Edit Session
              </ThemedText>
              <Pressable onPress={closeModal} hitSlop={8}>
                <IconSymbol name="xmark.circle.fill" size={24} color="#888B90" />
              </Pressable>
            </View>

            <StyledInput
              label="Date"
              placeholder="YYYY-MM-DD"
              value={editDate}
              onChangeText={setEditDate}
              autoFocus
            />
            <StyledInput
              label="Lab Name"
              placeholder="e.g. Quest Diagnostics"
              value={editLabName}
              onChangeText={setEditLabName}
            />
            <StyledInput
              label="Notes"
              placeholder="Any additional notes..."
              value={editNotes}
              onChangeText={setEditNotes}
              multiline
            />

            <View className="flex-row gap-3">
              <PrimaryButton
                label="Cancel"
                variant="ghost"
                onPress={closeModal}
                className="flex-1"
              />
              <PrimaryButton
                label="Save"
                loading={saving}
                disabled={!editDate.trim()}
                onPress={handleSaveSession}
                className="flex-1"
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
