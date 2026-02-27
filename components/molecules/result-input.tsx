import { View, Text } from 'react-native';
import { StyledInput } from '@/components/atoms/text-input';
import type { BloodMarker, UnitPreference } from '@/types/database';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';

type ResultInputProps = {
  marker: BloodMarker;
  index: number;
  control: Control<any>;
  errors?: FieldErrors;
  unitPreference: UnitPreference;
};

export function ResultInput({ marker, index, control, errors, unitPreference }: ResultInputProps) {
  const displayUnit =
    unitPreference === 'imperial' && marker.altUnit
      ? marker.altUnit
      : marker.defaultUnit;

  const fieldError = (errors?.results as any)?.[index]?.value;

  return (
    <View className="flex-row items-end gap-3 py-2">
      <View className="flex-1">
        <Controller
          control={control}
          name={`results.${index}.value`}
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledInput
              label={`${marker.name} (${marker.shortName})`}
              placeholder={`${marker.referenceLow}–${marker.referenceHigh}`}
              keyboardType="decimal-pad"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={fieldError?.message}
            />
          )}
        />
      </View>
      <View className="pb-3">
        <Text className="text-sm font-medium text-gunmetal/60 dark:text-cloud/40">
          {displayUnit}
        </Text>
      </View>
    </View>
  );
}
