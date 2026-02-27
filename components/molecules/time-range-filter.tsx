import { View, Pressable, Text } from 'react-native';
import { cn } from '@/lib/utils/cn';

export type TimeRange = '3M' | '6M' | '1Y' | 'All';

type Props = {
  selected: TimeRange;
  onChange: (range: TimeRange) => void;
};

const OPTIONS: TimeRange[] = ['3M', '6M', '1Y', 'All'];

export function TimeRangeFilter({ selected, onChange }: Props) {
  return (
    <View className="flex-row bg-gunmetal/30 dark:bg-cloud/5 rounded-xl p-1">
      {OPTIONS.map((option) => {
        const isActive = option === selected;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            className={cn(
              'flex-1 py-2 rounded-lg items-center',
              isActive && 'bg-brand-500',
            )}
          >
            <Text
              className={cn(
                'text-sm font-semibold',
                isActive ? 'text-white' : 'text-gunmetal dark:text-cloud/60',
              )}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
